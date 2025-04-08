import { translations } from './translations.js';

let currentLang = 'ru';

// Инициализация системы перевода
export function initTranslation() {
    // Проверяем сохраненный язык
    const savedLang = localStorage.getItem('preferredLanguage');

    if (savedLang) {
        setLanguage(savedLang);
    } else {
        const browserLang = navigator.language.slice(0, 2);
        if (translations[browserLang]) {
            setLanguage(browserLang);
        } else {
            setLanguage('ru');
        }
    }

    document.getElementById('RU')?.addEventListener('click', () => setLanguage('ru'));
    document.getElementById('EN')?.addEventListener('click', () => setLanguage('en'));
}

// Установка языка с обновлением интерфейса
export function setLanguage(lang) {
    currentLang = lang;

    // Сохраняем выбор пользователя
    localStorage.setItem('preferredLanguage', lang);

    document.documentElement.lang = lang;

    // Обновляем подчеркивание активного языка
    updateActiveLanguageIndicator(lang);

    // Применяем переводы
    applyTranslations();
}

// Обновление индикатора активного языка
function updateActiveLanguageIndicator(lang) {
    const languageButtons = document.querySelectorAll('.sidebar_languages button');

    languageButtons.forEach(btn => {
        btn.classList.remove('active-language');

        if (btn.id === lang.toUpperCase()) {
            btn.classList.add('active-language');
        }
    });
}

// Применение переводов к странице
function applyTranslations() {
    // Текстовые элементы
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang]?.[key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // Placeholder
    document.querySelectorAll('[data-translate-placeholder]').forEach(input => {
        const key = input.getAttribute('data-translate-placeholder');
        if (translations[currentLang]?.[key]) {
            input.setAttribute('placeholder', translations[currentLang][key]);
        }
    });
}

export function translateText(key) {
    return translations[currentLang]?.[key] || key;
}

export function getCurrentLanguage() {
    return currentLang;
}