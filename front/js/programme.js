const URL_PROGRAMME = "/api/programme";

async function chargerProgramme() {
  const elementListe = document.getElementById("programme-liste");

  try {
    const aujourdhui = new Date();
    const elementDate = document.getElementById("date-du-jour");
    elementDate.textContent = `Date du jour : ${formaterDate(aujourdhui)}`;

    const reponse = await fetch(URL_PROGRAMME);
    const activites = await reponse.json();

    // ----- Aujourd'hui -----
    const activiteJour = activitesDuJour(activites, aujourdhui);
    elementListe.textContent = "";

    if (activiteJour.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Rien de prévu aujourd'hui 🎉";
      elementListe.appendChild(li);
    } else {
      const maintenant = heureActuelle();
      activiteJour.forEach((activite) => {
        const li = document.createElement("li");
        li.textContent = `${activite.debut} · ${activite.fin} · ${activite.titre} · ${activite.lieu}`;
        if (activite.fin <= maintenant) {
          li.classList.add("passee");
        } else if (activite.debut <= maintenant) {
          li.classList.add("en-cours");
        }
        elementListe.appendChild(li);
      });
    }

    // ----- Demain -----
    const demain = new Date();
    demain.setDate(demain.getDate() + 1);

    const elementDateDemain = document.getElementById("date-demain");
    elementDateDemain.textContent = `Demain : ${formaterDate(demain)}`;

    const activitesDemain = activitesDuJour(activites, demain);
    const elementListeDemain = document.getElementById("programme-demain");
    elementListeDemain.textContent = "";

    if (activitesDemain.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Rien de prévu demain 😴";
      elementListeDemain.appendChild(li);
    } else {
      activitesDemain.forEach((activite) => {
        const li = document.createElement("li");
        li.textContent = `${activite.debut} · ${activite.fin} · ${activite.titre} · ${activite.lieu}`;
        elementListeDemain.appendChild(li);
      });
    }

  } catch (erreur) {
    console.error(erreur);
    elementListe.textContent = "⚠️ Programme indisponible";
    setTimeout(chargerProgramme, 30 * 1000);
  }
}

function formaterDate(date){
    let y = String(date.getFullYear());
    let m = String(date.getMonth() + 1);
    let d = String(date.getDate());

    if ((m).length === 1) { m = `0${m}`; }
    if (d.length === 1) { d = `0${d}`; }
    return d + '/' + m + '/' + y;
}

function activitesDuJour(liste, jour){
    const actjour = [];
    const date = formaterDate(jour);
    for (let i = 0; i< liste.length; i++){
        if (liste[i].date === date){
            actjour.push(liste[i]);
        }
    }
    actjour.sort((a, b) => a.debut.localeCompare(b.debut));
    return actjour;
}

function heureActuelle(){
    const maintenant = new Date();
    let h = String(maintenant.getHours());
    let m = String(maintenant.getMinutes());

    if (h.length === 1) { h = `0${h}`; }
    if (m.length === 1) { m = `0${m}`; }

    return h + ":" + m;
}

chargerProgramme();
setInterval(chargerProgramme, 60 * 1000);
