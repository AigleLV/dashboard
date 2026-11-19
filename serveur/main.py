from fastapi import FastAPI
from datetime import datetime
import json
from pathlib import Path
from fastapi.staticfiles import StaticFiles


DOSSIER_PROJET = Path(__file__).parent.parent
FICHIER_PROGRAMME = DOSSIER_PROJET / "programme.json"
DOSSIER_FRONT = DOSSIER_PROJET / "front"

app = FastAPI()          # crée l'application



@app.get("/api/heure")
def heure():
    return {"heure": datetime.now().strftime("%H:%M")}

@app.get("/api/programme")
def programme():
    with open(FICHIER_PROGRAMME, encoding="utf-8") as fichier:
        donnees = json.load(fichier)
    return donnees

app.mount("/", StaticFiles(directory=DOSSIER_FRONT, html=True), name="front")