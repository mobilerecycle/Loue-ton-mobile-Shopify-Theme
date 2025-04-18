theme.headerSection = (function () {
  function header() {
    /* Mobile Menu Function */
    const offcanvasHeader = function () {
      const offcanvasOpen = document.querySelector(
          ".header__actions_btn--menu"
        ),
        offcanvasClose = document.querySelector(".offcanvas__close_btn"),
        offcanvasHeader = document.querySelector(".offcanvas-header"),
        offcanvasMenu = document.querySelectorAll(".offcanvas__menu"),
        body = document.querySelector("body");

      /* Add a Button For SubMenu Toggle */
      offcanvasMenu.forEach((item) => {
        item
        .querySelectorAll(".offcanvas__sub_menu")
        .forEach(function (ul) {
          const subMenuToggle = document.createElement("button");
          subMenuToggle.classList.add("offcanvas__sub_menu_toggle");
          subMenuToggle.setAttribute("aria-label", "menu collapse");
          ul.parentNode.appendChild(subMenuToggle);
        });


      });
      
      /* Open/Close Menu On Click Toggle Button */
      offcanvasOpen.addEventListener("click", function (e) {
        e.preventDefault();
        offcanvasHeader.classList.add("open");
        body.style.overflowY = "hidden";
      });
      offcanvasClose.addEventListener("click", function (e) {
        e.preventDefault();
        offcanvasHeader.classList.remove("open");
        body.style.overflowY = null;
      });
      
      
      /* Open/Close Sub Menu On Click Toggle Button */
      offcanvasMenu.forEach((offcanvasMenuitem) => {
        offcanvasMenuitem
        .querySelectorAll(".offcanvas__sub_menu_toggle")
        .forEach(function (toggle) {
          toggle.addEventListener("click", function (e) {
            e.preventDefault();
            const parent = this.parentElement;
            if (parent.classList.contains("active")) {
              this.classList.remove("active");
              parent.classList.remove("active");
              parent
              .querySelectorAll(".offcanvas__sub_menu")
              .forEach(function (subMenu) {
                subMenu.parentElement.classList.remove("active");
                subMenu.nextElementSibling.classList.remove("active");
                slideUp(subMenu);
              });
            } else {
              this.classList.add("active");
              parent.classList.add("active");
              slideDown(this.previousElementSibling);
              getSiblings(parent).forEach(function (item) {
                item.classList.remove("active");
                item
                .querySelectorAll(".offcanvas__sub_menu")
                .forEach(function (subMenu) {
                  subMenu.parentElement.classList.remove("active");
                  subMenu.nextElementSibling.classList.remove("active");
                  slideUp(subMenu);
                });
              });
            }
          });
        });                   
      })
      

      document.addEventListener("click", function (event) {
        if (
          !event.target.closest(".header__actions_btn--menu") &&
          !event.target.classList.contains(
            ".header__actions_btn--menu".replace(/\./, "")
          )
        ) {
          if (
            !event.target.closest(".offcanvas-header") &&
            !event.target.classList.contains(
              ".offcanvas-header".replace(/\./, "")
            )
          ) {
            offcanvasHeader.classList.remove("open");
            body.style.overflowY = null;
          }
        }
      });

      /* Remove Mobile Menu Open Class & Hide Mobile Menu When Window Width in More Than 991 */
      window.addEventListener("resize", function () {
        if (window.outerWidth >= 992) {
          offcanvasHeader.classList.remove("open");
          body.style.overflowY = null;
        }
      });
    };
    /* Mobile Menu Active */
    offcanvasHeader();
  }

  return header;
})();
