const URL_METEO = "/api/meteo";

const VILLES = [
  { id: "saint-martin", nom: "Saint-Martin-d'Hères" },
  { id: "meribel", nom: "Méribel" },
  { id: "val-darc", nom: "Val-d'Arc"}
];

let indexVille = 0;

async function chargerMeteo() {
  try {
    const ville = VILLES[indexVille];
    const reponse = await fetch(`${URL_METEO}?ville=${ville.id}`);
    const donnees = await reponse.json();

    const elementville = document.getElementById("meteo-ville");
    elementville.textContent = ville.nom;

    const elementTemperature = document.getElementById("meteo-temperature");
    elementTemperature.textContent = `Température actuelle : ${Math.round(donnees.current.temperature_2m)} °C`;
    
    const elementCode = document.getElementById("meteo-code");
    elementCode.textContent = `Météo : ${decrireMeteo(donnees.current.weather_code)}`;

    const elementMax = document.getElementById("meteo-max");
    elementMax.textContent = `Température maximum : ${Math.round(donnees.daily.temperature_2m_max[0])} °C`;
    
    const elementMin = document.getElementById("meteo-min");
    elementMin.textContent = `Température minimum : ${Math.round(donnees.daily.temperature_2m_min[0])} °C`;
    
    const elementPluieMm = document.getElementById("meteo-pluie-mm");
    elementPluieMm.textContent = `Pluie totale : ${donnees.daily.precipitation_sum[0].toFixed(1)} mm`;

    const elementPluieProba = document.getElementById("meteo-pluie-proba");
    elementPluieProba.textContent = `Risque de pluie : ${Math.round(donnees.daily.precipitation_probability_max[0])} %`;

  } 
  catch (error){
    console.error(error);
    const elementTemperature = document.getElementById("meteo-temperature");
    elementTemperature.textContent = "⚠️ Météo indisponible";
    setTimeout(chargerMeteo, 30 * 1000);
  }
}

function decrireMeteo(code){
    if (code === 0) { return "☀️ Ciel dégagé"; }
    if (code === 1) { return "🌤️ Peu nuageux"; }
    if (code === 2) { return "⛅ Partiellement nuageux"; }
    if (code === 3) { return "☁️ Couvert"; }    
    if (code === 45 || code === 48) { return "🌫️ Brouillard"; }
    if (code === 51 || code === 53 || code === 55) { return "🌦️ Bruine"; }  
    if (code === 56 || code === 57) { return "🌧️ Bruine verglaçante"; }
    if (code === 61) { return "🌧️ Pluie faible"; }
    if (code === 63) { return "🌧️ Pluie moyenne"; }
    if (code === 65) { return "🌧️ Pluie forte"; }
    if (code === 66 || code === 67) { return "🌧️ Pluie verglaçante"; }
    if (code === 71) { return "🌨️ Neige faible"; }
    if (code === 73) { return "🌨️ Neige moyenne"; }
    if (code === 75) { return "🌨️ Neige forte"; }
    if (code === 77) { return "🌨️ Grains de neige"; }
    if (code >= 80 && code <= 82) { return "🌦️ Averses"; }
    if (code === 85 || code === 86) { return "🌨️ Averses de neige"; }
    if (code === 95) { return "⛈️ Orage"; }
    if (code === 96 || code === 99) { return "⛈️ Orage avec grêle"; }

    return "❓ Inconnu"
}

function villeSuivante() {
  indexVille = (indexVille + 1) % VILLES.length;
  chargerMeteo();
}

function villePrecedente() {
  indexVille = (indexVille - 1 + VILLES.length) % VILLES.length;
  chargerMeteo();
}

chargerMeteo();
setInterval(chargerMeteo, 15 * 60 * 1000);

const boutonPrecedent = document.getElementById("meteo-precedent");
const boutonSuivant = document.getElementById("meteo-suivant");
boutonPrecedent.addEventListener("click", villePrecedente);
boutonSuivant.addEventListener("click", villeSuivante);