# Apprendre en s'amusant

<script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.11.0/brython.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.11.0/brython_stdlib.min.js"></script>

**Question :** Quelle est la valeur de 3 * 7 ?

<div style="margin: 20px 0;">
    <input id="reponse_eleve" placeholder="Votre réponse ici" style="padding: 5px;">
    <button id="bouton_valider" style="padding: 5px; cursor: pointer;">Valider</button>
</div>

<div id="resultat" style="font-weight:bold; min-height: 20px;"></div>

<script type="text/python">
from browser import document, alert

def verifier(ev):
    # On récupère la valeur
    reponse = document["reponse_eleve"].value
    
    # Vérification
    if reponse.strip() == "21":
        document["resultat"].text = "✅ Bravo ! C'est la bonne réponse."
        document["resultat"].style.color = "green"
    else:
        document["resultat"].text = "❌ Faux, c'est incorrect."
        document["resultat"].style.color = "red"

# On attache le clic du bouton à la fonction
document["bouton_valider"].bind("click", verifier)
</script>

<script>
    brython();
</script>