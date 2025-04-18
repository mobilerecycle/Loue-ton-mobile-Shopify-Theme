theme.lookbookSlider = (function () {
  function lookBook(e) {
    let slideshow = e.querySelector(".lookbook--slider"),
      paginationSelector = e.querySelector(".swiper-pagination"),
      navselectorPrev = e.querySelector(".swiper-button-prev"),
      navselectorNext = e.querySelector(".swiper-button-next");

    var lookbookSlider = new Swiper(slideshow, {
      loop: true,
      spaceBetween: 20,
      pagination: {
        el: paginationSelector,
        clickable: true,
      },
      autoplay: false,
      autoHeight: false,
      navigation: {
        nextEl: navselectorNext,
        prevEl: navselectorPrev,
      },
      breakpoints: {
        320: {
          slidesPerView: 2,
        },
        750: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 2,
        },
      },
    });

    // Lookbook hotspot connect
    const lookbookHotspot = e.querySelectorAll(".lookbook--product-hotspot");
    if (lookbookHotspot.length > 0) {
      lookbookHotspot.forEach((button) => {
        button?.addEventListener("mouseover", function (event) {
          lookbookSlider.slideToLoop(parseInt(button.dataset.index));
          slideshow.classList.add("lookbook__hover--active");
        });
        button?.addEventListener("mouseout", function (event) {
          slideshow.classList.remove("lookbook__hover--active");
        });
      });
    }

    if (lookbookHotspot.length > 0) {
      lookbookHotspot.forEach((button) => {
        button?.addEventListener("click", function (event) {
          lookbookSlider.slideToLoop(parseInt(button.dataset.index));
          slideshow.classList.add("lookbook__hover--active");
        });
      });
    }

    // Active class
    lookbookSlider.on("slideChange", function () {
      const realIndex = lookbookSlider.realIndex;
      if (lookbookHotspot.length > 0) {
        lookbookHotspot.forEach((button) => {
          button.classList.remove("active");
          if (parseInt(button.dataset.index) == realIndex) {
            button.classList.add("active");
          }
        });
      }
    });
  }
  return lookBook;
})();
