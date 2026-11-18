const URL_METEO = "https://api.open-meteo.com/v1/forecast?latitude=45.17&longitude=5.77&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&current=temperature_2m,weather_code,precipitation&timezone=Europe%2FParis&forecast_days=1";

async function chargerMeteo() {
  const reponse = await fetch(URL_METEO);
  const donnees = await reponse.json();

  console.log(donnees);
  console.log("Actuelle :", donnees.current.temperature_2m);
  console.log("Max :", donnees.daily.temperature_2m_max[0]);
  console.log("Min :", donnees.daily.temperature_2m_min[0]);
  console.log("Code météo :", donnees.current.weather_code);
  console.log("Pluie (mm) :", donnees.daily.precipitation_sum[0]);
  console.log("Pluie (%) :", donnees.daily.precipitation_probability_max[0]);
}

chargerMeteo();