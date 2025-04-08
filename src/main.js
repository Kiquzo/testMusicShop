import { adSlider } from './adSlider.js';
import { mSlider } from './mSlider.js';
import { openMenu } from './menu.js';
import { modal } from './modalContact.js';
import { modalPhones } from './modalPhones.js';
import { initTranslation } from './translate.js';

document.addEventListener('DOMContentLoaded', () => {
    initTranslation();

    // Инициализируем подчеркивание для текущего языка
    const currentLang = localStorage.getItem('preferredLanguage') || 'ru';
    const langBtn = document.getElementById(currentLang.toUpperCase());
    if (langBtn) {
        langBtn.classList.add('active-language');
    }
});

modal();
modalPhones();
openMenu();
adSlider();
mSlider();