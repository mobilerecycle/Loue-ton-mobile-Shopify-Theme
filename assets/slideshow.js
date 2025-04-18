theme.SlideShow = (function () {
  function Slider(e) {
    let slideshow = e.querySelector(".slideshow__wrapper"),
      paginationSelector = e.querySelector(".swiper-pagination"),
      navselectorPrev = e.querySelector(".swiper-button-prev"),
      navselectorNext = e.querySelector(".swiper-button-next"),
      autoplaySelctor = e.dataset.sliderAutoplay,
      autoplayInit = false,
      autoPlayDelay = parseInt(e.dataset.sliderDelay),
      loopSelector = e.dataset.sliderLoop,
      loopInit = false,
      slidePagination = e.dataset.pagination,
      paginatinInit = "bullets";

    if (autoplaySelctor == "true") {
      autoplayInit = { delay: autoPlayDelay };
    }
    if (loopSelector == "true") {
      loopInit = true;
    }

    if (slidePagination == "counter") {
      paginatinInit = "fraction";
    }

    var swiper = new Swiper(slideshow, {
      loop: loopInit,
      pagination: {
        el: paginationSelector,
        clickable: true,
        type: paginatinInit,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      },
      autoplay: autoplayInit,
      autoHeight: false,
      speed: 1500,
      navigation: {
        nextEl: navselectorNext,
        prevEl: navselectorPrev,
      },
    });
  }
  return Slider;
})();
