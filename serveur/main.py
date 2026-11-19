from fastapi import FastAPI
from datetime import datetime

app = FastAPI()          # crée l'application


@app.get("/")            # quand quelqu'un visite l'adresse "/"...
def accueil():
    return {"message": "Bonjour depuis mon dashboard !"}   # ...on renvoie ce dictionnaire

@app.get("/heure")
def heure():
    return {"heure": datetime.now().strftime("%H:%M")}