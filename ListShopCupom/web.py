from fastapi import FastAPI, Form, HTTPException, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import shlex

app = FastAPI(title="ListShopCupom")

BASE_DIR = Path(__file__).parent
KEYWORDS_FILE = BASE_DIR / "keywords.json"
IGNORE_FILE = BASE_DIR / "ignore.json"

# -------------------------
# Templates e Static
# -------------------------
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name="static",
)

# -------------------------
# Utils
# -------------------------
def load_json(path: Path, default):
    if not path.exists():
        return default
    content = path.read_text(encoding="utf-8").strip()
    if not content:
        return default
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return default


def save_json(path: Path, data):
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def parse_quoted_args(raw: str):
    """
    Exemplo: '"cupom sophee" ".*\\\\d+\\\\s?%"'
    """
    try:
        return shlex.split(raw)
    except ValueError:
        raise HTTPException(status_code=400, detail="Erro ao interpretar argumentos")


# -------------------------
# Home (HTML)
# -------------------------
@app.get("/")
def index(request: Request):
    keywords = load_json(KEYWORDS_FILE, {})
    ignores = load_json(IGNORE_FILE, [])
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "keywords": keywords,
            "ignores": ignores,
            "total_keywords": len(keywords),
            "total_ignores": len(ignores),
        },
    )


# -------------------------
# Keywords
# -------------------------
@app.get("/keywords")
def list_keywords():
    return load_json(KEYWORDS_FILE, {})


@app.post("/keywords/add")
def add_keyword(raw: str = Form(...)):
    args = parse_quoted_args(raw)
    if len(args) == 0:
        raise HTTPException(status_code=400, detail="Informe ao menos a palavra")

    palavra = args[0].lower()
    regex = args[1] if len(args) > 1 else None

    keywords = load_json(KEYWORDS_FILE, {})
    keywords[palavra] = {"regex": regex}
    save_json(KEYWORDS_FILE, keywords)

    return {"status": "ok", "palavra": palavra, "regex": regex}


@app.post("/keywords/remove")
def remove_keyword(palavra: str = Form(...)):
    palavra = palavra.lower()
    keywords = load_json(KEYWORDS_FILE, {})

    if palavra not in keywords:
        raise HTTPException(status_code=404, detail="Palavra não encontrada")

    del keywords[palavra]
    save_json(KEYWORDS_FILE, keywords)

    return {"status": "ok", "removed": palavra}


# -------------------------
# Ignore
# -------------------------
@app.get("/ignore")
def list_ignores():
    return load_json(IGNORE_FILE, [])


@app.post("/ignore/add")
def add_ignore(raw: str = Form(...)):
    args = parse_quoted_args(raw)
    if len(args) == 0:
        raise HTTPException(status_code=400, detail='Uso correto: "termo"')

    termo = args[0].lower()
    ignores = load_json(IGNORE_FILE, [])

    if termo not in ignores:
        ignores.append(termo)
        save_json(IGNORE_FILE, ignores)

    return {"status": "ok", "added": termo}


@app.post("/ignore/remove")
def remove_ignore(termo: str = Form(...)):
    termo = termo.lower()
    ignores = load_json(IGNORE_FILE, [])

    if termo not in ignores:
        raise HTTPException(status_code=404, detail="Termo não encontrado")

    ignores.remove(termo)
    save_json(IGNORE_FILE, ignores)

    return {"status": "ok", "removed": termo}

