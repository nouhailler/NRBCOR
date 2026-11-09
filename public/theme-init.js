// Applique le thème avant le premier rendu (évite le flash clair/sombre).
// Fichier externe (et non script inline) pour permettre une CSP stricte : script-src 'self'.
(function () {
  try {
    var m = localStorage.getItem('nrbcor_theme_mode');
    var dark = m === 'dark' || (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.add(dark ? 'dark' : 'light');
  } catch (e) {}
})();
