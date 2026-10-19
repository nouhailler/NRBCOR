/**
 * Informations et métadonnées de version centralisées de l'application NRBCOR.
 * Récupère dynamiquement la version définie dans vite.config.ts / package.json.
 */

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? `${__APP_VERSION__} PWA` : '1.2.0 PWA';
export const APP_BUILD_DATE = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '19 Octobre 2026';
export const APP_NAME = 'NRBCOR Protection Civile';
