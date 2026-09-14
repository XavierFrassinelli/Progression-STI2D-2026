---
toc: false
---

# Logique combinatoire

Des interrupteurs à l'algèbre de Boole : on manipule un montage électrique, et à chaque clic la
formalisation suit — symbole normalisé (NF EN 60617), équation, table de vérité.

- **Palier 1 · 0 et 1** — la variable logique, ses deux états, la table de vérité.
- **Palier 2 · NON, ET, OU** — les trois fonctions de base, les contacts en série et en parallèle.

Chaque écran présente à gauche le montage (interrupteurs, contacts, lampe) et à droite l'écriture
formelle correspondante. La sortie est notée **S**.

Les paliers étiquetés **Avancé** (forme canonique, fonctions universelles, OU-exclusif, lois de De Morgan,
missions) viendront compléter l'application.

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
