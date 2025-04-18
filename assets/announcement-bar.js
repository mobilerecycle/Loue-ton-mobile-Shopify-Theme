theme.announcement = (function () {
  function announcementModule(element) {
    const announcement = {
      open: document.getElementById("announcement-more-info"),
      close: document.querySelector(".close__announcement--bar"),
      wrapper: document.querySelector(".announcement-collapsible-content"),
    };

    // Hide the announcement bar
    const hide = () => {
      announcement.wrapper.classList.remove("open");
      announcement.open.classList.remove("show--dropdown");
      slideUp(announcement.wrapper);
    };

    // open the announcement bar
    const open = () => {
      announcement.wrapper.classList.add("open");
      announcement.open.classList.add("show--dropdown");
      slideDown(announcement.wrapper);
    };

    // Click open event
    announcement.open?.addEventListener("click", (event) => {
      event.preventDefault();
      let isOpen = announcement.wrapper.classList.contains("open")
        ? true
        : false;
      if (isOpen) {
        hide();
      } else {
        open();
      }
    });

    // Click close event
    announcement.close?.addEventListener("click", (event) => {
      event.preventDefault();
      hide();
    });
  }
  return announcementModule;
})();
