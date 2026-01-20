import http from "k6/http";
import { check, sleep, group } from "k6";
import { SharedArray } from "k6/data";
import { Trend, Rate } from "k6/metrics";

// -------------------------
// URLs (do seu ambiente)
// -------------------------
const AUTH_URL = "https://back.homologacao.apphealth.com.br:9000/oauth/token";
const GQL_URL = "https://back.homologacao.apphealth.com.br/api/v1/graphql";

// -------------------------
// Segredos / config via ENV
// -------------------------
const BASIC = __ENV.BASIC_AUTH; // parte após "Authorization: Basic "
if (!BASIC) {
    throw new Error(
        "Defina BASIC_AUTH antes de rodar (o valor após 'Authorization: Basic ' na chamada /oauth/token)."
    );
}

// IDs que o createAgendamento precisa.
// Dá pra buscar tipo/convenio via GraphQL, mas pra começar mais simples,
// coloque via env var (pegue do HAR, e depois a gente automatiza se quiser).
const CONVENIO_ID = Number(__ENV.CONVENIO_ID || "776");
const CONVENIO_DESC = __ENV.CONVENIO_DESC || "Convenio Teste";
const TIPO_ID = __ENV.TIPO_ID || "QVBQSEVBTFRIX1dFQjphcHBoZWFsdGg="; // id do tipo de agendamento (do HAR, base64)

// Datas do teste
const TEST_START_DATE = __ENV.START_DATE || "2026-01-18"; // yyyy-mm-dd
const USERS_PER_DAY = Number(__ENV.USERS_PER_DAY || "20"); // 20 usuários por dia -> evita colisão
const BASE_TIME = __ENV.BASE_TIME || "08:00"; // HH:MM
const SLOT_MINUTES = Number(__ENV.SLOT_MINUTES || "15"); // duração do agendamento

// -------------------------
// Entrada: usuários
// -------------------------
const users = new SharedArray("users", () => JSON.parse(open("./users.json")));

// -------------------------
// Métricas
// -------------------------
const tLogin = new Trend("login_ms");
const tAgenda = new Trend("agenda_ms");
const tCreate = new Trend("create_ms");
const errRate = new Rate("errors");

// -------------------------
// Cenário 100 VUs
// -------------------------
export const options = {
    scenarios: {
        s1: {
            executor: "constant-vus",
            vus: 100,
            duration: "5m",
            gracefulStop: "30s",
        },
    },
    thresholds: {
        http_req_failed: ["rate<0.01"],         // <1% falhas (ajuste conforme SLA)
        errors: ["rate<0.01"],
        http_req_duration: ["p(95)<2000"],      // p95 global (exemplo)
        login_ms: ["p(95)<2000"],
        agenda_ms: ["p(95)<2500"],
        create_ms: ["p(95)<3000"],
    },
};

// -------------------------
// Helpers
// -------------------------
function pickUser() {
    const idx = (__VU - 1) % users.length;
    return users[idx];
}

function oauthLogin(cpf, senha) {
    const body =
        `grant_type=password&username=${encodeURIComponent(cpf)}` +
        `&password=${encodeURIComponent(senha)}` +
        `&client_id=APPHEALTH_WEB`;

    const res = http.post(AUTH_URL, body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${BASIC}`,
            "Origin": "https://sistema.homologacao.apphealth.com.br",
            "Referer": "https://sistema.homologacao.apphealth.com.br/",
        },
        timeout: "30s",
        tags: { name: "oauth_token" },
    });

    tLogin.add(res.timings.duration);

    const ok = check(res, {
        "login status 200": (r) => r.status === 200,
        "tem access_token": (r) => !!r.json("access_token"),
    });

    if (!ok) errRate.add(1);
    return ok ? res.json("access_token") : null;
}

function gql(token, query, variables, tagName) {
    const res = http.post(GQL_URL, JSON.stringify({ query, variables }), {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        timeout: "30s",
        tags: { name: tagName || "graphql" },
    });
    return res;
}

// Data/time helpers (evitar colisão de horário entre 100 usuários)
function addDays(yyyy_mm_dd, days) {
    const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + days);
    const yy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(dt.getUTCDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
}

function timeToMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function minutesToTime(min) {
    const h = Math.floor(min / 60) % 24;
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function buildSlotForVU() {
    const idx = __VU - 1;
    const dayOffset = Math.floor(idx / USERS_PER_DAY);
    const inDay = idx % USERS_PER_DAY;

    const date = addDays(TEST_START_DATE, dayOffset);

    const baseMin = timeToMinutes(BASE_TIME);
    const startMin = baseMin + inDay * SLOT_MINUTES;
    const endMin = startMin + SLOT_MINUTES;

    return {
        date,
        horaInicio: minutesToTime(startMin),
        horaFim: minutesToTime(endMin),
    };
}

// -------------------------
// GraphQL: queries da Agenda (do seu HAR)
// -------------------------
const Q_AGENDA_CONFIG = `
  fragment dadosDia on HorarioAtendimento {
    horaInicio
    horaFim
    permiteAgendamento
  }
  fragment dias on ConfiguracaoHorarioAtendimento {
    domingo { ...dadosDia }
    segunda: segundaFeira { ...dadosDia }
    terca: tercaFeira { ...dadosDia }
    quarta: quartaFeira { ...dadosDia }
    quinta: quintaFeira { ...dadosDia }
    sexta: sextaFeira { ...dadosDia }
    sabado { ...dadosDia }
  }
  query($filter: SearchAgendamentoDTOInput){
    configuracaoHorarioAtendimentoVigente:
      configuracaoHorarioAtendimentoVigenteOutrosProfissionaisSaude(searchDTO: $filter) {
        id
        horaInicioPeriodoAtendimento
        horaFimPeriodoAtendimento
        duracao
        ...dias
      }
  }
`;

const Q_OUTROS_AGENDAMENTOS = `
  query($filterAgendamento: SearchAgendamentoDTOInput){
    agendamentos: findAllAgendamentoOutrosProfissionaisSaude(searchDTO: $filterAgendamento) {
      totalElements
      content { id }
    }
  }
`;

const Q_JA_TEM_HORARIO = `
  query ($agendamento: AgendamentoInput) {
    jaPossuiAgendamentoNesteHorario(agendamento: $agendamento)
  }
`;

// -------------------------
// GraphQL: mutation criar agendamento (do seu HAR)
// -------------------------
const M_CREATE = `
  mutation ($agendamento: AgendamentoInput) {
    createAgendamento (agendamento : $agendamento)  {
      id
      sujeitoAtencao { id }
    }
  }
`;

// -------------------------
// IMPORTANTE: obter unidadeId e profissionalSaudeId
// Você pode automatizar via GraphQL (se existir no schema do seu ambiente)
// ou setar via ENV. Vou deixar via ENV pra não travar você.
// -------------------------
const UNIDADE_ID = Number(__ENV.UNIDADE_ID || "12944");
const PROFISSIONAL_ID = Number(__ENV.PROFISSIONAL_ID || "26231");

export default function () {
    const u = pickUser();

    // 1) Login
    let token = null;
    group("1) Login", () => {
        token = oauthLogin(u.cpf, u.senha);
    });
    if (!token) return;

    // 2) Abrir Agenda (config + listagem)
    group("2) Agenda", () => {
        const filter = {
            dataInicial: TEST_START_DATE,
            dataFinal: TEST_START_DATE,
            unidadeId: UNIDADE_ID,
            profissionalSaudeId: PROFISSIONAL_ID,
        };

        const t0 = Date.now();

        const r1 = gql(token, Q_AGENDA_CONFIG, { filter }, "gql_agenda_config");
        const r2 = gql(token, Q_OUTROS_AGENDAMENTOS, { filterAgendamento: { ...filter, pageSize: 2000, pageNumber: 0 } }, "gql_agendamentos_outros");

        const ok =
            check(r1, { "agenda_config 200": (r) => r.status === 200 }) &&
            check(r2, { "outros_agendamentos 200": (r) => r.status === 200 });

        if (!ok) errRate.add(1);
        tAgenda.add(Date.now() - t0);
    });

    // 3) Criar agendamento (cada VU em data/horário diferente)
    group("3) Criar agendamento", () => {
        const { date, horaInicio, horaFim } = buildSlotForVU();

        const agendamento = {
            data: date,
            horaInicio,
            horaFim,
            situacao: "AGENDADO",
            nome: `LoadTest VU${__VU} I${__ITER}`,
            telefone: `449999${String(__VU).padStart(4, "0")}`, // evita repetir
            remoto: false,
            unidade: { id: UNIDADE_ID },
            sala: null,
            urgente: false,
            listaDeEspera: false,
            solicitante: null,
            profissionalSaude: { id: PROFISSIONAL_ID },
            convenio: { id: CONVENIO_ID, descricao: CONVENIO_DESC },
            tipo: { id: TIPO_ID },
            procedimentos: [],
        };

        const t0 = Date.now();

        // (Opcional, mas ajuda a não falhar por conflito)
        const rCheck = gql(token, Q_JA_TEM_HORARIO, { agendamento }, "gql_ja_tem_horario");
        const okCheck = check(rCheck, { "check horario 200": (r) => r.status === 200 });
        if (!okCheck) {
            errRate.add(1);
            tCreate.add(Date.now() - t0);
            return;
        }

        // Se já tiver agendamento, você pode abortar ou seguir (aqui eu abortei para evitar erro)
        const jaTem = rCheck.json("data.jaPossuiAgendamentoNesteHorario");
        if (jaTem === true) {
            // Marca como "erro lógico" pra você enxergar que colidiu
            errRate.add(1);
            tCreate.add(Date.now() - t0);
            return;
        }

        const rCreate = gql(token, M_CREATE, { agendamento }, "gql_create_agendamento");

        const okCreate = check(rCreate, {
            "create 200": (r) => r.status === 200,
            "create sem erro GraphQL": (r) => !r.json("errors"),
            "create retornou id": (r) => !!r.json("data.createAgendamento.id"),
        });

        if (!okCreate) errRate.add(1);
        tCreate.add(Date.now() - t0);
    });

    sleep(1);
}
