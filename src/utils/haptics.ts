/**
 * Utilitaire de retour haptique (vibrations tactiles) pour smartphones et tablettes PWA.
 * Renforce le sentiment de contrôle et de confirmation en situation de stress d'urgence.
 * Sans effet sur desktop (dégradation gracieuse silencieuse).
 */

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'warning' | 'success';

export function triggerHaptic(type: HapticFeedbackType = 'light'): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        // Clic ou sélection rapide (15 ms)
        navigator.vibrate(15);
        break;
      case 'medium':
        // Action confirmée (35 ms)
        navigator.vibrate(35);
        break;
      case 'heavy':
        // Action d'urgence majeure
        navigator.vibrate([45, 30, 45]);
        break;
      case 'warning':
        // Avertissement ou consigne critique
        navigator.vibrate([40, 50, 40]);
        break;
      case 'success':
        // Validation étape vitale
        navigator.vibrate([25, 40, 25]);
        break;
    }
  } catch (err) {
    // Les navigateurs qui bloquent l'API sans interaction utilisateur ne doivent pas lever d'exception
  }
}
