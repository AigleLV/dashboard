const URL_PROGRAMME = "programme.json";

async function chargerProgramme() {
  const elementListe = document.getElementById("programme-liste");

  try {
    // Affiche la date du jour
    const elementCode = document.getElementById("date-du-jour");
    elementCode.textContent = `Date : ${dateDuJour()}`;

    const reponse = await fetch(URL_PROGRAMME);
    const activites = await reponse.json();

    const activiteJour = activitesDuJour(activites);

    elementListe.textContent = "";   // on vide la liste avant de la remplir

    if (activiteJour.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Rien de prévu aujourd'hui 🎉";
        elementListe.appendChild(li);
        return;
    }

    activiteJour.forEach((activite) => {
      const li = document.createElement("li");      // 1. créer
      li.textContent = `${activite.debut} · ${activite.fin} · ${activite.titre} · ${activite.lieu}`;      // 2. remplir
      elementListe.appendChild(li);     // 3. ajouter
    });

  } catch (erreur) {
    console.error(erreur);
    elementListe.textContent = "⚠️ Programme indisponible";
    setTimeout(chargerProgramme, 30 * 1000);
  }
}

function dateDuJour(){
    const maintenant = new Date();
    let y = String(maintenant.getFullYear());
    let m = String(maintenant.getMonth() + 1);
    let d = String(maintenant.getDate());

    if ((m).length === 1) { m = `0${m}`; }
    if (d.length === 1) { d = `0${d}`; }

    const date = d + '/' + m + '/' + y;
    return date;
}

function activitesDuJour(liste){
    const actjour = [];
    const date = dateDuJour();
    for (let i = 0; i< liste.length; i++){
        if (liste[i].date === date){
            actjour.push(liste[i]);
        }
    }
    actjour.sort((a, b) => a.debut.localeCompare(b.debut));
    return actjour;
}


chargerProgramme();