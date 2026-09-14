---
toc: false
---

# Logique combinatoire

Des interrupteurs à l'algèbre de Boole : on manipule un montage électrique, et à chaque clic la
formalisation suit — symbole normalisé (NF EN 60617), équation, table de vérité.

- **Palier 1 · 0 et 1** — la variable logique, ses deux états, la table de vérité.
- **Palier 2 · NON, ET, OU** — les trois fonctions de base, les contacts en série et en parallèle.
- **Palier 3 · Canonique** — un produit par ligne à 1, la notation condensée Σ m(...).
- **Palier 4 · Énoncés** — traduire un cahier des charges en variables et en équation, puis vérifier un cas.
- **Palier 5 · NON-ET / NON-OU** — les fonctions universelles, et pourquoi une seule porte suffit.
- **Palier 6 · OU-exclusif** — « l'un ou l'autre, mais pas les deux », parité et détection d'incohérence.
- **Palier 7 · Équivalences** — les lois de De Morgan, l'absorption, la distributivité, vérifiées par les tables.
- **Palier 8 · Missions** — un dossier technique complet par énoncé, puis un bilan noté sur 20.

Chaque écran présente à gauche le montage (interrupteurs, contacts, lampe ou logigramme) et à droite
l'écriture formelle correspondante, mise à jour en même temps. La sortie est notée **S**.

L'onglet **Défi** enchaîne 10 questions notées sur 20, l'onglet **Mémo** récapitule les symboles, les
tables et les identités, et le **bilan du palier 8** tire ses questions de tous les paliers en terminant
par un récapitulatif groupé par thème.

<iframe
  id="logique-frame"
  src="../../assets/logique.html"
  style="width:100%;height:1000px;border:1px solid #e4e4e4;border-radius:8px;display:block;"
  loading="lazy"
  allow="clipboard-write"
></iframe>

<script>
  // L'application mesure son propre contenu et ajuste la hauteur de l'iframe.
  (function () {
    window.addEventListener('message', function (ev) {
      var d = ev.data;
      if (!d || d.type !== 'iframe-resize' || d.id !== 'logique') return;
      var frame = document.getElementById('logique-frame');
      if (!frame) return;
      var h = Math.max(420, Math.min(6000, Number(d.height) || 0)) + 16;
      frame.style.height = h + 'px';
    });
  })();
</script>
