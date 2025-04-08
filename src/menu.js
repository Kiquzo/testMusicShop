export function openMenu() {
    const burgerMenu = document.getElementById('open-sidebar');
    const sidebar = document.getElementById('sidebar');

    burgerMenu.addEventListener('click', () => {
        if (!sidebar.classList.contains('open')) {
            // Если меню закрыто, открываем его и добавляем анимацию "bounceIn"
            sidebar.classList.add('open', 'animate__backInDown');
            sidebar.classList.remove('animate__backOutUp'); // Убираем анимацию "bounceOut"
        } else {
            // Если меню открыто, закрываем его и добавляем анимацию "bounceOut"
            sidebar.classList.add('animate__backOutUp');
            sidebar.classList.remove('animate__backInDown'); // Убираем анимацию "bounceIn"

            // Используем timeout для задержки, чтобы анимация "bounceOut" завершилась перед закрытием
            setTimeout(() => {
                sidebar.classList.remove('open'); // Закрываем меню после анимации
            }, 1000); // 1000 мс (время анимации)
        }
    });
}