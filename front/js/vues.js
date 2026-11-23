const VUES = [
  { id: "vue-demain", nom: "Demain" },
  { id: "vue-calendrier", nom: "Calendrier" },
  { id: "vue-ajouter", nom: "Ajouter" },
];

let indexVue = 0;

function afficherVue() {
  VUES.forEach((vue, i) => {
    const bloc = document.getElementById(vue.id);
    bloc.hidden = i !== indexVue;
  });

  const elementOnglet = document.getElementById("programme-onglet");
  elementOnglet.textContent = VUES[indexVue].nom;
}

function vueSuivante() {
  indexVue = (indexVue + 1) % VUES.length;
  afficherVue();
}

function vuePrecedente() {
  indexVue = (indexVue - 1 + VUES.length) % VUES.length;
  afficherVue();
}

const boutonVuePrecedente = document.getElementById("programme-precedent");
const boutonVueSuivante = document.getElementById("programme-suivant");
boutonVuePrecedente.addEventListener("click", vuePrecedente);
boutonVueSuivante.addEventListener("click", vueSuivante);

afficherVue();