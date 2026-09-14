---
toc: false
---

# Conversions et puissances de dix

Exercice interactif pour automatiser les conversions d'unités : préfixes (kilo, milli, micro…),
décalage de la virgule, écriture scientifique, unités au carré et au cube (mm², cm², cm³, mm³),
et pièges classiques (1 m³ = 1 000 L, mA ↔ A…).

<iframe
  id="conversions-frame"
  src="../assets/conversions.html"
  style="width:100%;height:900px;border:1px solid #e4e4e4;border-radius:8px;display:block;"
  loading="lazy"
  allow="clipboard-write"
></iframe>

<script>
  // L'exercice mesure son propre contenu et ajuste la hauteur de l'iframe.
  (function () {
    window.addEventListener('message', function (ev) {
      var d = ev.data;
      if (!d || d.type !== 'iframe-resize' || d.id !== 'conversions') return;
      var frame = document.getElementById('conversions-frame');
      if (!frame) return;
      var h = Math.max(420, Math.min(6000, Number(d.height) || 0)) + 16;
      frame.style.height = h + 'px';
    });
  })();
</script>
