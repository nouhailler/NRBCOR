/**
 * Puppeteer n'est utilisé que pour les scripts de capture locaux.
 * En intégration continue (GitHub Actions, build Cloudflare Pages), on évite de
 * télécharger Chromium (~150 Mo) : le build n'en a pas besoin.
 */
module.exports = {
  skipDownload: Boolean(process.env.CI || process.env.CF_PAGES),
};
