theme.headerMainMenuModule = (function () {
  function mainMenu(e) {
    let headerWrapper = e.querySelector(".header_bottom");
    let menuLiSelector = document.querySelectorAll(".header__menu_li");

    // console.log(headerWrapper);
    menuLiSelector.forEach((item) => {
      if (item.classList.contains("menu__item_has_children")) {
        let menuItemUrl = "",
          menuItemLocation = "";
        item.addEventListener("mouseover", (event) => {
          let listDetails = item.querySelector("details");
          listDetails.setAttribute("open", "");
          item.querySelector("summary").setAttribute("aria-expanded", true);
          headerWrapper.classList.add("mega--menu-open");
        });
        item.addEventListener("mouseleave", (event) => {
          let listDetails = item.querySelector("details");
          listDetails.removeAttribute("open");
          item.querySelector("summary").setAttribute("aria-expanded", false);
        });
        item.querySelector("summary").addEventListener("click", (event) => {
          event.stopPropagation();
          menuItemUrl = item.querySelector("summary").dataset.href;
          menuItemLocation = `${menuItemUrl}`;
          let itemAttr = item.querySelector("details");
          if (itemAttr.hasAttribute("open")) {
            location.href = `${menuItemLocation}`;
          }
        });
      }
    });
  }
  return mainMenu;
})();
