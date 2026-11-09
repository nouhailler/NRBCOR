// Enregistrement du Service Worker (hors-ligne). Externe pour la CSP stricte.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function (err) {
      console.log('SW registration note:', err);
    });
  });
}
