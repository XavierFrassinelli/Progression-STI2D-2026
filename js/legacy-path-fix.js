(function () {
  const OLD_PATH = '/Progression-STI2D-2025/';
  const NEW_PATH = '/Progression-STI2D-2026/';
  const OLD_ABSOLUTE = 'https://lidlkidjoe.github.io/Progression-STI2D-2025/';
  const NEW_ABSOLUTE = 'https://xavierfrassinelli.github.io/Progression-STI2D-2026/';

  function rewriteUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.includes(OLD_ABSOLUTE)) return url.replaceAll(OLD_ABSOLUTE, NEW_ABSOLUTE);
    if (url.includes(OLD_PATH)) return url.replaceAll(OLD_PATH, NEW_PATH);
    return url;
  }

  function rewriteAttribute(el, attr) {
    const current = el.getAttribute(attr);
    if (!current) return;
    const next = rewriteUrl(current);
    if (next !== current) {
      el.setAttribute(attr, next);
    }
  }

  function applyFixes(root) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll('a[href], img[src], iframe[src], source[src], video[src], audio[src], script[src]').forEach((el) => {
      if (el.hasAttribute('href')) rewriteAttribute(el, 'href');
      if (el.hasAttribute('src')) rewriteAttribute(el, 'src');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyFixes(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node && node.nodeType === Node.ELEMENT_NODE) {
            applyFixes(node);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
