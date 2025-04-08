export function mSlider() {
    const msliderWrapper = document.querySelector(".musicians__slider__container-content");
    const mslides = document.querySelectorAll(".musicians-slide");
    const mLeft = document.querySelector(".musicians_left");
    const mRight = document.querySelector(".musicians_right");

    let mcurrentSlide = 14;
    const mslideWidth = mslides[0].offsetWidth + 30;
    let isTransitioning = false;

    const slidesToClone = 14;
    for (let i = 0; i < slidesToClone; i++){
        let cloneFirst = mslides[i].cloneNode(true);
        let cloneLast = mslides[mslides.length - 1 - i].cloneNode(true);
        msliderWrapper.appendChild(cloneFirst);
        msliderWrapper.insertBefore(cloneLast, mslides[0]);
    }

    // Сдвигаем слайдер в начальную позицию
    msliderWrapper.style.transform = `translateX(${-mslideWidth * mcurrentSlide}px)`;

    function mshowSlide(index, animated = true) {
        if (animated) {
            msliderWrapper.style.transition = "transform 1s ease-in-out";
        } else {
            msliderWrapper.style.transition = "none";
        }
        msliderWrapper.style.transform = `translateX(${-index * mslideWidth}px)`;
    }

    function mnextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        mcurrentSlide++;
        mshowSlide(mcurrentSlide);

        setTimeout(() => {
            if (mcurrentSlide >= mslides.length + slidesToClone) {
                mcurrentSlide = slidesToClone; // Перескакиваем на начало
                mshowSlide(mcurrentSlide, false);
            }
            isTransitioning = false;
        }, 1000);
    }

    function mprevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        mcurrentSlide--;
        mshowSlide(mcurrentSlide);

        setTimeout(() => {
            if (mcurrentSlide < slidesToClone) {
                mcurrentSlide = mslides.length;
                mshowSlide(mcurrentSlide, false);
            }
            isTransitioning = false;
        }, 1000);
    }

    mLeft.addEventListener("click", mprevSlide);
    mRight.addEventListener("click", mnextSlide);
}