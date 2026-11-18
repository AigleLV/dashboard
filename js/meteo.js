const URL_METEO = "https://api.open-meteo.com/v1/forecast?latitude=45.17&longitude=5.77&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&current=temperature_2m,weather_code,precipitation&timezone=Europe%2FParis&forecast_days=1";

async function chargerMeteo() {
  const reponse = await fetch(URL_METEO);
  const donnees = await reponse.json();

  const elementTemperature = document.getElementById("meteo-temperature");
  elementTemperature.textContent = `Temperature actuelle : ${Math.round(donnees.current.temperature_2m)} °C`;
 
  const elementCode = document.getElementById("meteo-code");
  elementCode.textContent = `Météo : ${Math.round(donnees.current.weather_code)} `; // TODO : convertir le code en mot (mission 4)

  const elementMax = document.getElementById("meteo-max");
  elementMax.textContent = `Temperature maximum : ${Math.round(donnees.daily.temperature_2m_max[0])} °C`;
  
  const elementMin = document.getElementById("meteo-min");
  elementMin.textContent = `Temperature minimum : ${Math.round(donnees.daily.temperature_2m_min[0])} °C`;
  
  const elementPluieMm = document.getElementById("meteo-pluie-mm");
  elementPluieMm.textContent = `Pluie totale : ${donnees.daily.precipitation_sum[0].toFixed(1)} mm`;

  const elementPluieProba = document.getElementById("meteo-pluie-proba");
  elementPluieProba.textContent = `Risque de pluie : ${Math.round(donnees.daily.precipitation_probability_max[0])} %`;

}

chargerMeteo();