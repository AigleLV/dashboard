const palettes = document.querySelectorAll(".palette");

// Écrit un chiffre dans un des 4 morceaux d'une palette
function remplir(palette, morceau, chiffre) {
  palette.querySelector(morceau + " span").textContent = chiffre;
}

// Au démarrage : on construit les 4 morceaux de chaque palette
palettes.forEach((palette) => {
  palette.innerHTML = `
    <span class="moitie haut"><span>0</span></span>
    <span class="moitie bas"><span>0</span></span>
    <span class="volet haut"><span>0</span></span>
    <span class="volet bas"><span>0</span></span>`;
  palette.dataset.chiffre = "0";   // on mémorise le chiffre affiché

  // Quand le volet du bas a fini de se rabattre, tout affiche le nouveau chiffre
  palette.querySelector(".volet.bas").addEventListener("animationend", () => {
    const chiffre = palette.dataset.chiffre;
    remplir(palette, ".moitie.bas", chiffre);
    remplir(palette, ".volet.haut", chiffre);
    palette.classList.remove("bascule");
  });
});

// Fait basculer une palette vers un nouveau chiffre
function changerChiffre(palette, nouveau) {
  const ancien = palette.dataset.chiffre;
  if (ancien === nouveau) return;   // rien n'a changé : on ne bouge pas

  palette.dataset.chiffre = nouveau;
  remplir(palette, ".moitie.haut", nouveau);  // révélé quand le volet tombe
  remplir(palette, ".moitie.bas", ancien);    // reste visible jusqu'à la fin
  remplir(palette, ".volet.haut", ancien);    // celui qui tombe
  remplir(palette, ".volet.bas", nouveau);    // celui qui se rabat
  palette.classList.add("bascule");
}

function afficherHeure() {
  const maintenant = new Date();
  let h = String(maintenant.getHours());
  let m = String(maintenant.getMinutes());
  let s = String(maintenant.getSeconds());

  if (h.length === 1) { h = `0${h}`; }
  if (m.length === 1) { m = `0${m}`; }
  if (s.length === 1) { s = `0${s}`; }

  const chiffres = h + m + s;
  for (let i = 0; i < chiffres.length; i++) {
    changerChiffre(palettes[i], chiffres[i]);
  }
}

afficherHeure();
setInterval(afficherHeure, 1000);