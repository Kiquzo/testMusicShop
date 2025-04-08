export function adSlider() {
    const sliderWrapper = document.querySelector(".ad__slider__container-content");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".ad__slider-dot");
    const adLeft = document.querySelector(".ad_left");
    const adRight = document.querySelector(".ad_right");

    let currentSlide = 0;
    const slideWidth = slides[0].offsetWidth;
    let autoSlideInterval;

    function showSlide(index) {
        sliderWrapper.style.transform = `translateX(${-index * slideWidth}px)`;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); 
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    adLeft.addEventListener("click", () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    adRight.addEventListener("click", () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    // Останавливаем автоматическое переключение при наведении на слайдер
    sliderWrapper.addEventListener("mouseenter", stopAutoSlide);
    sliderWrapper.addEventListener("mouseleave", startAutoSlide);

    showSlide(currentSlide);
    startAutoSlide(); 
}