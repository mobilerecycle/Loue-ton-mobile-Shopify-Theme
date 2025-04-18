theme.timelineSlider = (function () {
  function timeline(e) {
    let slideshow = e.querySelector(".timeline--slider"),
      paginationSelector = e.querySelector(".swiper-pagination"),
      navselectorPrev = e.querySelector(".swiper-button-prev"),
      navselectorNext = e.querySelector(".swiper-button-next");

    var timelineSlideshow = new Swiper(slideshow, {
      loop: true,
      spaceBetween: 20,
      speed: 700,
      pagination: {
        el: paginationSelector,
        clickable: true,
      },
      autoplay: false,
      autoHeight: true,
      navigation: {
        nextEl: navselectorNext,
        prevEl: navselectorPrev,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        750: {
          slidesPerView: 1,
        },
        992: {
          slidesPerView: 1,
        },
      },
    });

    // Timeline bullet connect
    const timelineBullet = e.querySelectorAll(".timeline__bullet");
    if (timelineBullet.length > 0) {
      timelineBullet.forEach((button) => {
        button?.addEventListener("click", function (event) {
          timelineSlideshow.slideToLoop(parseInt(button.dataset.index));
        });
      });
    }

    // Active class
    timelineSlideshow.on("slideChange", function () {
      const realIndex = timelineSlideshow.realIndex;
      if (timelineBullet.length > 0) {
        timelineBullet.forEach((button) => {
          button.classList.remove("active");
          if (parseInt(button.dataset.index) == realIndex) {
            button.classList.add("active");
          }
        });
      }
    });
  }
  return timeline;
})();
