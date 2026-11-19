from fastapi import FastAPI
from datetime import datetime
import json
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import httpx

URL_METEO = "https://api.open-meteo.com/v1/forecast?latitude=45.17&longitude=5.77&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&current=temperature_2m,weather_code,precipitation&timezone=Europe%2FParis&forecast_days=1"

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

@app.get("/api/meteo")
def meteo():
    reponse = httpx.get(URL_METEO)
    return reponse.json()

app.mount("/", StaticFiles(directory=DOSSIER_FRONT, html=True), name="front")