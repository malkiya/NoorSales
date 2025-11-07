import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode } from 'react';
import { ar } from './i18n/ar';
import { en } from './i18n/en';

type Language = 'ar' | 'en';
export type Translations = typeof ar; // or typeof en, they should have the same shape

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: keyof Translations, replacements?: { [key: string]: string | number }) => string;
}

const translations: { [key in Language]: Translations } = {
    ar,
    en
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem('language') as Language) || 'ar';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const t = (key: keyof Translations, replacements?: { [key: string]: string | number }): string => {
        let translation: string = translations[language][key] || String(key);
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                const regex = new RegExp(`{${placeholder}}`, 'g');
                translation = translation.replace(regex, String(replacements[placeholder]));
            });
        }
        return translation;
    };

    const contextValue = useMemo(() => ({
        language,
        setLanguage,
        t
    }), [language]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
