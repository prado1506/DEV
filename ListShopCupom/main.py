import json
import logging
import re
from pathlib import Path
from telethon import TelegramClient, events
from config import API_ID, API_HASH, ALERT_CHAT, KEYWORDS_FILE

# ========================
# Paths
# ========================
BASE_DIR = Path(__file__).parent
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "listshopcupom.log"

IGNORE_FILE = BASE_DIR / "ignore.json"

# ========================
# Logging
# ========================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ListShopCupom")

# ========================
# Helpers JSON
# ========================
def load_json(path, default):
    if not path.exists():
        return default
    try:
        data = json.loads(path.read_text(encoding="utf-8").strip())
        return data if data else default
    except Exception:
        return default

def save_json(path, data):
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

# ========================
# Data
# ========================
keywords = load_json(Path(KEYWORDS_FILE), {})
ignore_list = load_json(IGNORE_FILE, [])

# ========================
# Telegram Client
# ========================
client = TelegramClient("listshopcupom_session", API_ID, API_HASH)

# ========================
# Utils
# ========================
def extract_quoted(text):
    return re.findall(r'"([^"]+)"', text)

def should_ignore(text):
    t = text.lower()
    return any(term in t for term in ignore_list)

# ========================
# Commands
# ========================

@client.on(events.NewMessage(pattern=r'^/add(\s|$)'))
async def add_keyword(event):
    args = extract_quoted(event.raw_text)

    if not args:
        await event.reply('❌ Uso correto:\n/add "palavra" "regex(opcional)"')
        return

    palavra = args[0].lower()
    regex = args[1] if len(args) > 1 else None

    keywords[palavra] = {"regex": regex}
    save_json(Path(KEYWORDS_FILE), keywords)

    logger.info(f"Keyword adicionada: {palavra} | regex={regex}")
    await event.reply(f"✅ Palavra adicionada:\n{palavra}")

@client.on(events.NewMessage(pattern=r'^/list$'))
async def list_keywords(event):
    if not keywords:
        await event.reply("📭 Nenhuma palavra cadastrada.")
        return

    msg = [f"Total de palavras monitoradas: {len(keywords)}\n"]
    for k, v in keywords.items():
        r = v.get("regex")
        msg.append(f"Palavra: {k}\nregex: {r if r else '❌'}\n")

    await event.reply("\n".join(msg))

@client.on(events.NewMessage(pattern=r'^/ignore(\s|$)'))
async def add_ignore(event):
    args = extract_quoted(event.raw_text)

    if not args:
        await event.reply('❌ Uso correto:\n/ignore "termo"')
        return

    termo = args[0].lower()
    if termo not in ignore_list:
        ignore_list.append(termo)
        save_json(IGNORE_FILE, ignore_list)
        logger.info(f"Ignorado: {termo}")

    await event.reply(f"🚫 Ignorado:\n{termo}")

@client.on(events.NewMessage(pattern=r'^/ignorelist$'))
async def ignore_list_cmd(event):
    if not ignore_list:
        await event.reply("📭 Lista de ignorados vazia.")
        return

    msg = ["Lista de ignorados:\n"]
    for t in ignore_list:
        msg.append(f"- {t}")

    await event.reply("\n".join(msg))

# ========================
# Watcher
# ========================
@client.on(events.NewMessage)
async def watcher(event):
    if not event.text:
        return

    text = event.text.lower()

    if should_ignore(text):
        return

    for palavra, cfg in keywords.items():
        if palavra not in text:
            continue

        regex = cfg.get("regex")
        if regex:
            if not re.search(regex, event.text, re.IGNORECASE | re.DOTALL):
                continue

        logger.info(f"Match detectado: {palavra}")
        await client.send_message(
            ALERT_CHAT,
            f"🚨 Palavra detectada\n\nPalavra: {palavra}\nRegex: {regex or '❌'}\n\n{event.text}"
        )
        break

# ========================
# Start
# ========================
logger.info("ListShopCupom iniciado.")
client.start()
client.run_until_disconnected()
