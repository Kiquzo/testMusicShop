export function modalPhones() {
    document.addEventListener('DOMContentLoaded', () => {
        const openPhones = document.querySelectorAll(".open-phone");
        const phoneModal = document.querySelector(".contacts__modal"); // Берем один элемент

        // Проверяем, есть ли такие элементы в DOM
        if (!openPhones.length || !phoneModal) return;

        // Добавляем обработчик события для каждого элемента с классом "open-phone"
        openPhones.forEach(button => {
            button.addEventListener('click', () => {
                phoneModal.style.display = 'flex';
            });
        });

        window.addEventListener('click', (event) => {
            if (event.target === phoneModal) {
                phoneModal.style.display = 'none';
            }
        });
    });
}
