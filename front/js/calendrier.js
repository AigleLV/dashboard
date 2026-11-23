const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
              "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const JOURS_COURTS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

function afficherCalendrier() {
  const aujourdhui = new Date();
  const annee = aujourdhui.getFullYear();
  const mois = aujourdhui.getMonth();

  // Le titre : « Novembre 2026 »
  const elementTitre = document.getElementById("mois-annee");
  elementTitre.textContent = `${MOIS[mois]} ${annee}`;

  const grille = document.getElementById("calendrier-grille");
  grille.textContent = "";

  // 1. La ligne d'en-tête : Lu Ma Me …
  JOURS_COURTS.forEach((nom) => {
    const caseEntete = document.createElement("div");
    caseEntete.textContent = nom;
    caseEntete.classList.add("calendrier-entete");
    grille.appendChild(caseEntete);
  });

  // 2. Les cases vides avant le 1er
  const premierJour = new Date(annee, mois, 1);
  const casesVides = (premierJour.getDay() + 6) % 7;
  for (let i = 0; i < casesVides; i++) {
    const caseVide = document.createElement("div");
    grille.appendChild(caseVide);
  }

  // 3. Les jours du mois
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  for (let jour = 1; jour <= nbJours; jour++) {
    const caseJour = document.createElement("div");
    caseJour.textContent = jour;
    if (jour === aujourdhui.getDate()) {
      caseJour.classList.add("aujourdhui");
    }
    grille.appendChild(caseJour);
  }
}

afficherCalendrier();
setInterval(afficherCalendrier, 60 * 60 * 1000);