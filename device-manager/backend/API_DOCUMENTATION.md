# Device Manager API - Documentação Completa

API RESTful para gerenciamento de dispositivos com autenticação JWT usando Laravel 11 e Sanctum.

## 📋 Índice

- [Informações Gerais](#informações-gerais)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Devices](#devices)
- [Modelos de Dados](#modelos-de-dados)
- [Códigos de Status](#códigos-de-status)
- [Exemplos de Uso](#exemplos-de-uso)
- [Segurança](#segurança)
- [Usuários de Teste](#usuários-de-teste)

---

## 🌐 Informações Gerais

**Base URL:** `http://127.0.0.1:8000/api`

**Formato de resposta:** JSON

**Autenticação:** Bearer Token (JWT via Laravel Sanctum)

**Versão do Laravel:** 11.x

**Banco de Dados:** MySQL

---

## 🔐 Autenticação

A API utiliza tokens Bearer para autenticação. Após o login, inclua o token no header de todas as requisições protegidas:

```http
Authorization: Bearer {seu_token_aqui}
Fluxo de Autenticação
Registro → Criar conta (POST /register)

Login → Receber token (POST /login)

Usar token → Incluir em todas as requisições protegidas

Logout → Invalidar token (POST /logout)

📡 Endpoints
Auth
1. Registrar Usuário
Cria um novo usuário no sistema.

Endpoint: POST /api/register

Autenticação: ❌ Não requerida

Headers:

text
Content-Type: application/json
Body:

json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "senha12345",
  "password_confirmation": "senha12345"
}
Validações:

Campo	Regras
name	obrigatório, string, máx. 255 caracteres
email	obrigatório, email válido, único no banco
password	obrigatório, mín. 8 caracteres, confirmado
password_confirmation	obrigatório, deve ser igual a password
Resposta Sucesso (201 Created):

json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:00:00.000000Z",
    "updated_at": "2024-01-15T10:00:00.000000Z"
  }
}
Resposta Erro (422 Unprocessable Entity):

json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}
2. Login
Autentica um usuário e retorna um token de acesso.

Endpoint: POST /api/login

Autenticação: ❌ Não requerida

Headers:

text
Content-Type: application/json
Body:

json
{
  "email": "admin@example.com",
  "password": "senha123"
}
Validações:

Campo	Regras
email	obrigatório, email válido
password	obrigatório, string
Resposta Sucesso (200 OK):

json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz123456789"
}
Resposta Erro (401 Unauthorized):

json
{
  "message": "Email ou senha incorretos"
}
3. Logout
Invalida o token atual do usuário autenticado.

Endpoint: POST /api/logout

Autenticação: ✅ Requerida

Headers:

text
Authorization: Bearer {token}
Content-Type: application/json
Body: Não requerido

Resposta Sucesso (200 OK):

json
{
  "message": "Logout realizado com sucesso"
}
Resposta Erro (401 Unauthorized):

json
{
  "message": "Unauthenticated."
}
Devices
⚠️ Todos os endpoints de dispositivos requerem autenticação.

1. Listar Dispositivos
Retorna uma lista paginada de dispositivos do usuário autenticado com filtros opcionais.

Endpoint: GET /api/devices

Autenticação: ✅ Requerida

Headers:

text
Authorization: Bearer {token}
Query Parameters:

Parâmetro	Tipo	Obrigatório	Padrão	Descrição
page	integer	Não	1	Número da página
per_page	integer	Não	15	Itens por página (1-100)
location	string	Não	-	Filtrar por localização (busca parcial)
in_use	boolean	Não	-	Filtrar por status (true/false)
purchase_date_from	date	Não	-	Data inicial (YYYY-MM-DD)
purchase_date_to	date	Não	-	Data final (YYYY-MM-DD)
Exemplo de Requisição:

text
GET /api/devices?page=1&per_page=10&location=Escritório&in_use=true&purchase_date_from=2024-01-01&purchase_date_to=2024-12-31
Resposta Sucesso (200 OK):

json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro Max",
      "location": "Escritório - Sala 301",
      "purchase_date": "2024-01-15",
      "in_use": true,
      "user_id": 1,
      "created_at": "2024-01-15T10:00:00.000000Z",
      "updated_at": "2024-01-15T10:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Samsung Galaxy S24",
      "location": "Escritório - Mesa 5",
      "purchase_date": "2024-02-20",
      "in_use": false,
      "user_id": 1,
      "created_at": "2024-02-20T14:30:00.000000Z",
      "updated_at": "2024-02-20T14:30:00.000000Z"
    }
  ],
  "first_page_url": "http://127.0.0.1:8000/api/devices?page=1",
  "from": 1,
  "last_page": 2,
  "last_page_url": "http://127.0.0.1:8000/api/devices?page=2",
  "next_page_url": "http://127.0.0.1:8000/api/devices?page=2",
  "path": "http://127.0.0.1:8000/api/devices",
  "per_page": 15,
  "prev_page_url": null,
  "to": 15,
  "total": 20
}
2. Criar Dispositivo
Cria um novo dispositivo para o usuário autenticado.

Endpoint: POST /api/devices

Autenticação: ✅ Requerida

Headers:

text
Authorization: Bearer {token}
Content-Type: application/json
Body:

json
{
  "name": "iPhone 15 Pro Max",
  "location": "Escritório - Sala 301",
  "purchase_date": "2024-01-15",
  "in_use": true
}
Validações:

Campo	Regras
name	obrigatório, string, máx. 255 caracteres
location	obrigatório, string, máx. 255 caracteres
purchase_date	obrigatório, data válida (YYYY-MM-DD), não pode ser futura
in_use	opcional, boolean (padrão: false)
Resposta Sucesso (201 Created):

json
{
  "id": 16,
  "name": "iPhone 15 Pro Max",
  "location": "Escritório - Sala 301",
  "purchase_date": "2024-01-15",
  "in_use": true,
  "user_id": 1,
  "created_at": "2024-01-15T10:00:00.000000Z",
  "updated_at": "2024-01-15T10:00:00.000000Z"
}
Resposta Erro (422 Unprocessable Entity):

json
{
  "message": "The purchase date field must be a date before or equal to today.",
  "errors": {
    "purchase_date": [
      "The purchase date field must be a date before or equal to today."
    ]
  }
}
3. Exibir Dispositivo
Retorna os detalhes de um dispositivo específico do usuário autenticado.

Endpoint: GET /api/devices/{id}

Autenticação: ✅ Requerida

Headers:

text
Authorization: Bearer {token}
Parâmetros de URL:

Parâmetro	Tipo	Descrição
id	integer	ID do dispositivo
Exemplo:

text
GET /api/devices/1
Resposta Sucesso (200 OK):

json
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "location": "Escritório - Sala 301",
  "purchase_date": "2024-01-15",
  "in_use": true,
  "user_id": 1,
  "created_at": "2024-01-15T10:00:00.000000Z",
  "updated_at": "2024-01-15T10:00:00.000000Z"
}
Resposta Erro (404 Not Found):

json
{
  "message": "Dispositivo não encontrado"
}
4. Atualizar Dispositivo
Atualiza os dados de um dispositivo existente do usuário autenticado.

Endpoint: PUT /api/devices/{id}

Autenticação: ✅ Requerida

Headers:

text
Authorization: Bearer {token}
Content-Type: application/json
Body:

json
{
  "name": "iPhone 15 Pro Max - Atualizado",
  "location": "Home Office",
  "purchase_date": "2024-02-20",
  "in_use": false
}
Validações: Mesmas do endpoint de criar dispositivo

Resposta Sucesso (200 OK):

json
{
  "id": 1,
  "name": "iPhone 15 Pro Max - Atualizado",
  "location": "Home Office",
  "purchase_date": "2024-02-20",
  "in_use": false,
  "user_id": 1,
  "created_at": "2024-01-15T10:00:00.000000Z",
  "updated_at": "2024-01-15T11:30:00.000000Z"
}
5. Alternar Status de Uso
Alterna o status de uso do dispositivo entre "em uso" e "disponível".

Endpoint: PATCH /api/devices/{id}/use

Autenticação: ✅ Requerida

Headers:

text
Authorization: Bearer {token}
Body: Não requerido

Exemplo:

text
PATCH /api/devices/1/use
Comportamento:

Se in_use = false → muda para true

Se in_use = true → muda para false

Resposta Sucesso (200 OK):

json
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "location": "Escritório - Sala 301",
  "purchase_date": "2024-01-15",
  "in_use": true,
  "user_id": 1,
  "created_at": "2024-01-15T10:00:00.000000Z",
  "updated_at": "2024-01-15T12:00:00.000000Z"
}
6. Deletar Dispositivo
Deleta um dispositivo do usuário autenticado (soft delete).

Endpoint: DELETE /api/devices/{id}

Autenticação: ✅ Requerida

Headers:

text
Authorization: Bearer {token}
Exemplo:

text
DELETE /api/devices/1
Resposta Sucesso (200 OK):

json
{
  "message": "Dispositivo deletado com sucesso"
}
Resposta Erro (404 Not Found):

json
{
  "message": "Dispositivo não encontrado"
}
💡 Nota: O dispositivo não é removido permanentemente do banco. Ele recebe um timestamp em deleted_at (soft delete).

📊 Modelos de Dados
User
typescript
interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
Exemplo:

json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "email_verified_at": null,
  "created_at": "2024-01-15T10:00:00.000000Z",
  "updated_at": "2024-01-15T10:00:00.000000Z"
}
Device
typescript
interface Device {
  id: number;
  name: string;
  location: string;
  purchase_date: string; // YYYY-MM-DD
  in_use: boolean;
  user_id: number;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  deleted_at: string | null; // ISO 8601
}
Exemplo:

json
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "location": "Escritório - Sala 301",
  "purchase_date": "2024-01-15",
  "in_use": true,
  "user_id": 1,
  "created_at": "2024-01-15T10:00:00.000000Z",
  "updated_at": "2024-01-15T12:00:00.000000Z",
  "deleted_at": null
}
🔢 Códigos de Status HTTP
Código	Nome	Descrição
200	OK	Requisição bem-sucedida
201	Created	Recurso criado com sucesso
400	Bad Request	Requisição malformada
401	Unauthorized	Não autenticado ou token inválido
403	Forbidden	Autenticado mas sem permissão
404	Not Found	Recurso não encontrado
422	Unprocessable Entity	Erro de validação
500	Internal Server Error	Erro no servidor
💡 Exemplos de Uso
cURL
Registro
bash
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "senha12345",
    "password_confirmation": "senha12345"
  }'
Login
bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "senha123"
  }'
Listar Dispositivos
bash
curl -X GET "http://127.0.0.1:8000/api/devices?page=1&per_page=10" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Criar Dispositivo
bash
curl -X POST http://127.0.0.1:8000/api/devices \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "location": "Escritório",
    "purchase_date": "2024-01-15",
    "in_use": true
  }'
Atualizar Dispositivo
bash
curl -X PUT http://127.0.0.1:8000/api/devices/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro Max",
    "location": "Home Office",
    "purchase_date": "2024-02-20",
    "in_use": false
  }'
Alternar Status
bash
curl -X PATCH http://127.0.0.1:8000/api/devices/1/use \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Deletar Dispositivo
bash
curl -X DELETE http://127.0.0.1:8000/api/devices/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
JavaScript (Fetch API)
javascript
const BASE_URL = 'http://127.0.0.1:8000/api';

// Login e obter token
async function login(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return data.token;
}

// Listar dispositivos
async function getDevices(token, filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${BASE_URL}/devices?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}

// Criar dispositivo
async function createDevice(token, deviceData) {
  const response = await fetch(`${BASE_URL}/devices`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(deviceData)
  });
  return await response.json();
}

// Exemplo de uso
(async () => {
  const token = await login('admin@example.com', 'senha123');
  const devices = await getDevices(token, { page: 1, per_page: 10 });
  console.log(devices);
})();
PHP (usando Guzzle)
php
<?php

use GuzzleHttp\Client;

$client = new Client(['base_uri' => 'http://127.0.0.1:8000/api/']);

// Login
$response = $client->post('login', [
    'json' => [
        'email' => 'admin@example.com',
        'password' => 'senha123'
    ]
]);

$data = json_decode($response->getBody(), true);
$token = $data['token'];

// Listar dispositivos
$response = $client->get('devices', [
    'headers' => ['Authorization' => "Bearer $token"],
    'query' => ['page' => 1, 'per_page' => 10]
]);

$devices = json_decode($response->getBody(), true);
print_r($devices);
🔒 Segurança
Boas Práticas Implementadas
✅ Autenticação JWT via Laravel Sanctum
✅ Senhas criptografadas com bcrypt
✅ Validação de dados em todas as requisições
✅ Soft Delete para recuperação de dados
✅ Isolamento de dados (usuários só veem seus próprios dispositivos)
✅ CORS configurado para aceitar requisições do frontend
✅ Rate Limiting padrão do Laravel

Recomendações
⚠️ Produção:

Use HTTPS (SSL/TLS)

Configure rate limiting mais restritivo

Implemente refresh tokens

Configure expiração de tokens

Use variáveis de ambiente para credenciais

Habilite logging de acessos

👥 Usuários de Teste (Seeders)
Após executar php artisan migrate:fresh --seed, você terá:

Nome	Email	Senha
Admin User	admin@example.com	senha123
João Silva	joao@example.com	senha123
Maria Santos	maria@example.com	senha123
Dispositivos: 15 dispositivos de exemplo criados para o usuário Admin.

📝 Notas Importantes
Soft Delete: Dispositivos deletados não são removidos permanentemente. Use withTrashed() em queries para recuperá-los.

Datas: Todas as datas devem estar no formato YYYY-MM-DD. A data de compra não pode ser futura.

Paginação: O padrão é 15 itens por página. Máximo permitido: 100 itens por página.

Filtros: Podem ser combinados. Exemplo: ?location=Escritório&in_use=true&page=1

Token: Não expira por padrão. Configure em config/sanctum.php se necessário.

CORS: Configurado para aceitar requisições de http://localhost:4200

📞 Suporte
Para dúvidas, problemas ou sugestões:

Consulte o README.md do projeto

Verifique os testes em tests/Feature/

Importe a Postman Collection para testar os endpoints

📚 Recursos Adicionais
Postman Collection: postman_collection.json

Environment: postman_environment.json

Código-fonte: Disponível no repositório do projeto

Documentação atualizada em: 15 de Janeiro de 2026
Versão da API: 1.0.0
Desenvolvido com: Laravel 11 + Angular 19 + MySQL