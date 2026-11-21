from fastapi import FastAPI, HTTPException
from datetime import datetime
import json
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import httpx
import time
from icalendar import Calendar
from zoneinfo import ZoneInfo

VILLES = {
    "saint-martin" : [45.18, 5.76],
    "meribel"      : [45.41, 6.57],
    "val-darc"     : [45.54, 6.30]
}

cache_meteo = {}
heure_cache = {}

cache_ade = None
heure_ade = 0

DOSSIER_PROJET = Path(__file__).parent.parent
FICHIER_PROGRAMME = DOSSIER_PROJET / "programme.json"
DOSSIER_FRONT = DOSSIER_PROJET / "front"

FICHIER_ADE = Path(__file__).parent / "ade_url.txt"
URL_ADE = FICHIER_ADE.read_text().strip()
PARIS = ZoneInfo("Europe/Paris")

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


@app.get("/api/ade")
def ade():
    global cache_ade, heure_ade
    if cache_ade is not None and time.time() - heure_ade < 60 * 60:
        return cache_ade

    try:
        print("Appel à ADE")
        reponse = httpx.get(URL_ADE, timeout=60)
        reponse.raise_for_status()
        calendrier = Calendar.from_ical(reponse.content)
        cours = []
        for evenement in calendrier.walk("VEVENT"):
            titre = str(evenement["SUMMARY"])
            if titre.startswith("INF301") or titre.startswith("INF304"):
                debut = evenement["DTSTART"].dt.astimezone(PARIS)
                fin = evenement["DTEND"].dt.astimezone(PARIS)
                cours.append({
                    "date": debut.strftime("%d/%m/%Y"),
                    "debut": debut.strftime("%H:%M"),
                    "fin": fin.strftime("%H:%M"),
                    "titre": titre,
                    "lieu": str(evenement.get("LOCATION", "")),
                })
        cache_ade = cours
        heure_ade = time.time()
        return cache_ade

    except httpx.HTTPError as erreur:
        print(erreur)
        if cache_ade is not None:
            return cache_ade
        raise HTTPException(status_code=503, detail="Emploi du temps indisponible")

        

app.mount("/", StaticFiles(directory=DOSSIER_FRONT, html=True), name="front")