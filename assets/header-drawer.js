theme.headerSearch = (function () {
  function searchOverlay(e) {
    const input = e.querySelector('input[type="search"]');

    const headerHeight = document.querySelector('.header__area');
    document.documentElement.style.setProperty('--header-height', `${headerHeight.clientHeight}px`);
    
    let quickDrawer = (trigger, closeTrigger, wrapper ) => {
      	let offcanvasSearchTrigger = document.querySelectorAll(trigger),
            offcanvasSidebarSearch = document.querySelector(wrapper),
      	    offcanvasSearchClose = document.getElementById(closeTrigger);
      
      	
        offcanvasSearchTrigger.forEach((singleTrigger) => {
			if (singleTrigger) {
              singleTrigger.addEventListener("click", (event) => {
                event.preventDefault();
                offcanvasSidebarSearch.classList.add("active");

                offcanvasSidebarSearch.addEventListener(
                  "transitionend",
                  () => {
                    trapFocus(offcanvasSidebarSearch);
                     trapFocus(input);
                  },
                  { once: true }
                );
              });
              
              offcanvasSidebarSearch.addEventListener("keyup", (evt) => {
                if (evt.code === "Escape") {
                  offcanvasSidebarSearch.classList.remove("active");
                  removeTrapFocus(singleTrigger);
                }
              });
          
          		if (offcanvasSearchClose) {
                  offcanvasSearchClose.addEventListener("click", (event) => {
                    event.preventDefault();
                    offcanvasSidebarSearch.classList.remove("active");

                    removeTrapFocus(singleTrigger);
                  });
                }
            }
        })

        if(offcanvasSidebarSearch){
          document.addEventListener("click", function (event) {
            let eventTarget = event.target;
            if (
              !eventTarget.closest('#predictive__search_overlay, #quick__information_overlay') &&
              !eventTarget.closest('.header__actions_btn--search, .information--drawer__trigger')
            ) {
              offcanvasSidebarSearch.classList.remove("active");
            }
          });
        }

      
    }
    quickDrawer(".header__actions_btn--search", "search__close_btn", "#predictive__search_overlay");
  
    quickDrawer(".information--drawer__trigger", "quick__information--close_btn", "#quick__information_overlay");
    

  }
  return searchOverlay;
})();