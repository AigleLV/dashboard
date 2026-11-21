from fastapi import FastAPI, HTTPException
from datetime import datetime
import json
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import httpx
import time

VILLES = {
    "saint-martin" : [45.18, 5.76],
    "meribel"      : [45.41, 6.57],
    "val-darc"     : [45.54, 6.30]
}

cache_meteo = {}
heure_cache = {}

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
def meteo(ville: str = "saint-martin"):
    if ville not in VILLES:
        raise HTTPException(status_code=404, detail="Ville inconnue")
    url = f"https://api.open-meteo.com/v1/forecast?latitude={VILLES[ville][0]}&longitude={VILLES[ville][1]}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&current=temperature_2m,weather_code,precipitation&timezone=Europe%2FParis&forecast_days=1"

    if ville in cache_meteo and (time.time() - heure_cache[ville]) < 10*60:
        return cache_meteo[ville]

    else :
        try :
            print("Appel à Open-Meteo")
            reponse = httpx.get(url, timeout=10)
            reponse.raise_for_status()
            cache_meteo[ville] = reponse.json()
            heure_cache[ville] = time.time()
            return cache_meteo[ville]
        except httpx.HTTPError as erreur:
            print(erreur)
            if ville in cache_meteo:
                return cache_meteo[ville]
            else :
                raise HTTPException(status_code=503, detail="Service Indisponible")


app.mount("/", StaticFiles(directory=DOSSIER_FRONT, html=True), name="front")