const URL_SPOTIFY = "/api/spotify";

function formaterTemps(ms){
    const secondesTotales = Math.floor(ms / 1000);
    const minutes  = Math.floor(secondesTotales / 60);
    const secondes = secondesTotales % 60;
    return `${minutes}:${String(secondes).padStart(2, "0")}`;
}

async function chargerSpotify(){

    const pochette = document.getElementById("spotify-pochette");
    const titre = document.getElementById("spotify-titre");
    const artistes = document.getElementById("spotify-artistes");
    const barre = document.getElementById("spotify-barre");
    const temps = document.getElementById("spotify-temps");
    try {
        const reponse = await fetch(URL_SPOTIFY);
        const donnees = await reponse.json();
        if (!donnees.titre){
            titre.textContent = "Rien en lecture 🎧";
            artistes.textContent = "";
            temps.textContent    = "";
            barre.style.width    = "0%";
            pochette.hidden      = true;
            return;
        }
        pochette.src    = donnees.pochette;
        pochette.hidden = false;
        titre.textContent    = donnees.titre;
        artistes.textContent = donnees.artistes;

        const pourcentage = donnees.progression_ms / donnees.duree_ms * 100;
        barre.style.width = `${pourcentage}%`;

        temps.textContent = formaterTemps(donnees.progression_ms) + " / " + formaterTemps(donnees.duree_ms);
    }
    catch (erreur){
        console.error(erreur);
        titre.textContent = "⚠️ Spotify indisponible";
    }
    
}

chargerSpotify();
setInterval(chargerSpotify, 5000);