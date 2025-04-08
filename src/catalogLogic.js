document.addEventListener('DOMContentLoaded', function () {
    // Соответствие id категорий и секций
    const categoryMap = {
        'first-category': 'acustic',
        'second-category': 'electric',
        'third-category': 'bass',
        'fourth-category': 'guitarAmplifiers',
        'fifth-category': 'synthesizers',
        'six-category': 'drums',
        'seven-category': 'micros',
        'eight-category': 'acsesuars'
    };

    // Обратная карта для хэша URL
    const sectionToCategoryMap = {
        'acustic': 'first-category',
        'electric': 'second-category',
        'bass': 'third-category',
        'guitarAmplifiers': 'fourth-category',
        'synthesizers': 'fifth-category',
        'drums': 'six-category',
        'micros': 'seven-category',
        'acsesuars': 'eight-category'
    };

    // Получаем элементы
    const categoryLinks = document.querySelectorAll('.category__content');
    const catalogSections = document.querySelectorAll('.catalog');

    // Функция активации категории
    function activateCategory(categoryId) {
        const sectionId = categoryMap[categoryId];

        // Скрываем все секции
        catalogSections.forEach(section => {
            section.classList.remove('active-section');
        });

        // Показываем нужную секцию
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active-section');
            setTimeout(() => {
                activeSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }

        // Убираем подсветку у всех категорий
        categoryLinks.forEach(link => {
            link.classList.remove('active-category');
        });

        // Подсвечиваем активную категорию
        const activeLink = document.getElementById(categoryId);
        if (activeLink) {
            activeLink.classList.add('active-category');
        }

        // Сохраняем в localStorage
        localStorage.setItem('activeCatalogCategory', categoryId);
    }

    // Обработчики кликов
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            activateCategory(this.id);
        });
    });

    // Проверяем хэш при загрузке
    const hash = window.location.hash.substring(1);
    if (hash && sectionToCategoryMap[hash]) {
        activateCategory(sectionToCategoryMap[hash]);
    } else {
        // Активируем сохраненную или первую категорию
        const savedCategory = localStorage.getItem('activeCatalogCategory') || 'first-category';
        activateCategory(savedCategory);
    }
});