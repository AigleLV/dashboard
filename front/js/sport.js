const URL_SPORT = "/api/sport";
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

async function chargerSport() {
  const elementTitre = document.getElementById("sport-titre");
  const elementListe = document.getElementById("sport-liste");

  try {
    const reponse = await fetch(URL_SPORT);
    const semaine = await reponse.json();

    const jour = JOURS[new Date().getDay()];
    const seance = semaine[jour];

    elementTitre.textContent = seance.titre;

    elementListe.textContent = "";
    seance.exercices.forEach((exercice) => {
      const li = document.createElement("li");
      li.textContent = `${exercice.nom} · ${exercice.series} × ${exercice.reps}`;
      elementListe.appendChild(li);
    });
  } catch (erreur) {
    console.error(erreur);
    elementTitre.textContent = "⚠️ Sport indisponible";
    setTimeout(chargerSport, 30 * 1000);
  }
}

chargerSport();
setInterval(chargerSport, 60 * 60 * 1000);