import { useTranslation } from 'react-i18next';

export interface LocalizedString {
    en: string;
    ar: string;
}

/**
 * Get localized value from a LocalizedString object or legacy string.
 * For legacy strings, returns placeholder text for Arabic.
 */
export function getLocalizedValue(
    field: LocalizedString | string | undefined,
    language: string,
    fallback = ''
): string {
    if (!field) return fallback;

    // Legacy string support - return as-is for English, placeholder for Arabic
    if (typeof field === 'string') {
        if (language === 'ar') {
            return '[الترجمة قيد الإعداد]'; // "Translation pending" in Arabic
        }
        return field;
    }

    // New localized object format
    const value = field[language as 'en' | 'ar'];
    if (value) return value;

    // Fallback: try English, then placeholder
    if (field.en) {
        return language === 'ar' ? '[الترجمة قيد الإعداد]' : field.en;
    }

    return fallback;
}

/**
 * Hook to get localized content based on current language
 */
export function useLocalizedValue() {
    const { i18n } = useTranslation();

    return (field: LocalizedString | string | undefined, fallback = ''): string => {
        return getLocalizedValue(field, i18n.language, fallback);
    };
}
