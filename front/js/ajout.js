async function envoyerActivite(event) {
  event.preventDefault();

  const elementMessage = document.getElementById("ajout-message");

  const activite = {
    date: document.getElementById("date-ajout").value.split("-").reverse().join("/"),
    debut: document.getElementById("debut-ajout").value,
    fin: document.getElementById("fin-ajout").value,
    titre: document.getElementById("titre-ajout").value,
    lieu: document.getElementById("lieu-ajout").value,
  };

  try {
    const reponse = await fetch(URL_PROGRAMME, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activite),
    });

    if (!reponse.ok) {
      elementMessage.textContent = "⚠️ Erreur, activité non ajoutée";
      return;
    }

    formulaireAjout.reset();
    elementMessage.textContent = "✅ Activité ajoutée";
    chargerProgramme();
  } catch (erreur) {
    console.error(erreur);
    elementMessage.textContent = "⚠️ Serveur injoignable";
  }
}

const formulaireAjout = document.getElementById("formulaire-ajout");
formulaireAjout.addEventListener("submit", envoyerActivite);