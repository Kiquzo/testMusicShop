import { adSlider } from './adSlider.js';
import { mSlider } from './mSlider.js';
import { openMenu } from './menu.js';
import { modal } from './modalContact.js';
import { modalPhones } from './modalPhones.js';
import { initTranslation } from './translate.js';
import { seedb } from './tableDB.js';
import { seegraph } from './graph.js';

document.addEventListener('DOMContentLoaded', () => {
    initTranslation();

    // Инициализируем подчеркивание для текущего языка
    const currentLang = localStorage.getItem('preferredLanguage') || 'ru';
    const langBtn = document.getElementById(currentLang.toUpperCase());
    if (langBtn) {
        langBtn.classList.add('active-language');
    }
});

if (document.getElementById('table-select')) {
    seedb();
    seegraph();
}

if (document.getElementsByClassName("events")) {
    // Функция для загрузки событий из базы данных
async function loadEvents() {
    try {
        // Выполняем запрос к API для получения данных из таблицы Events
        const response = await fetch('/api/tables/Events');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке событий');
        }

        const events = await response.json();

        // Находим контейнер для событий
        const eventsContainer = document.querySelector('.events__items');
        if (!eventsContainer) {
            console.error('Контейнер .events__items не найден на странице');
            return;
        }

        // Очищаем контейнер перед добавлением новых элементов
        eventsContainer.innerHTML = '';

        // Создаем элементы event-item для каждого события
        events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');

            // Создаем HTML-структуру для каждого события
            eventItem.innerHTML = `
                <img src="${event.images}" alt="изображение события">
                <span>${event.subTitel}</span>
                <h3>${event.titel}</h3>
                <span>${event.place}</span>
            `;

            // Добавляем элемент в контейнер
            eventsContainer.appendChild(eventItem);
        });

        // Если на странице используется WOW.js для анимации, инициализируем его
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }
    } catch (error) {
        console.error('Ошибка при загрузке событий:', error);
    }
}

    loadEvents();
}

modal();
modalPhones();
openMenu();
adSlider();
mSlider();