// A simple wrapper for the Telegram WebApp HapticFeedback API.
// Provides a safe way to call haptic functions, checking for their existence first.

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'error' | 'success' | 'warning';

const getHapticFeedback = () => {
    try {
        return window.Telegram?.WebApp?.HapticFeedback;
    } catch (e) {
        return undefined;
    }
}

/**
 * Triggers an impact feedback.
 * @param {ImpactStyle} style - The style of the impact.
 */
export const hapticImpact = (style: ImpactStyle) => {
    const haptic = getHapticFeedback();
    if (haptic?.impactOccurred) {
        haptic.impactOccurred(style);
    }
};

/**
 * Triggers a notification feedback.
 * @param {NotificationType} type - The type of the notification.
 */
export const hapticNotification = (type: NotificationType) => {
    const haptic = getHapticFeedback();
    if (haptic?.notificationOccurred) {
        haptic.notificationOccurred(type);
    }
};

/**
 * Triggers a selection change feedback.
 */
export const hapticSelection = () => {
    const haptic = getHapticFeedback();
    if (haptic?.selectionChanged) {
        haptic.selectionChanged();
    }
};