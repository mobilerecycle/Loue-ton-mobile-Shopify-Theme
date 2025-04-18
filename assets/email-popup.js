if (!customElements.get("email-popup")) {
  customElements.define(
    "email-popup",
    class EmailPopup extends HTMLElement {
      constructor() {
        super();

        if (window.location.pathname === "/challenge") {
          return;
        }

        this.popup = this.querySelector(".email__popup--mdoal__content");
        this.closePopup = this.querySelectorAll(
          ".email__popup--toggle, .email-popup-overlay"
        );
        this.hidePopup = this.querySelector(".email__popup--hide");
        this.cookieName = "email-popup";
        this.closePopup.forEach((item) => {
          item.addEventListener("click", this.close.bind(this));
        });
        this.hidePopup?.addEventListener("click", this.hide.bind(this));

        if (!this.getCookie(this.cookieName) || this.dataset.mode === "test") {
          this.init();
        }

        if (Shopify.designMode) {
          document.addEventListener("shopify:section:load", (event) =>
            editorShopifyEvent(event, this, () => this.open.bind(this))
          );
          document.addEventListener("shopify:section:select", (event) =>
            editorShopifyEvent(event, this, this.open.bind(this))
          );
          document.addEventListener("shopify:section:deselect", (event) =>
            editorShopifyEvent(event, this, this.close.bind(this))
          );
        }
      }

      // Init popup
      init() {
        if (Shopify && Shopify.designMode) {
          return;
        }

        setTimeout(
          function () {
            this.open();
          }.bind(this),
          parseInt(this.dataset.delay) * 1000
        );
      }

      // Opne popup
      open() {
        document.body.classList.add("email-popup-show");
        this.popup.classList.add("popup-open");
      }

      // Close popup
      close() {
        this.popup.classList.add("popup-closing");
        setTimeout(() => {
          this.popup.classList.remove("popup-open");
          this.popup.classList.remove("popup-closing");
        }, 500);

        if (this.dataset.mode === "test") {
          this.removeCookie(this.cookieName);
          return;
        }
      }

      // Hide popup for fixed days

      hide() {
        this.popup.classList.add("popup-closing");
        setTimeout(() => {
          this.popup.classList.remove("popup-open");
          this.popup.classList.remove("popup-closing");
        }, 500);

        this.setCookie(this.cookieName, this.dataset.expire);
      }

      getCookie(name) {
        const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
        return match ? match[2] : null;
      }

      setCookie(name, expiry) {
        document.cookie = `${name}=true; max-age=${
          expiry * 24 * 60 * 60
        }; path=/`;
      }

      removeCookie(name) {
        document.cookie = `${name}=; max-age=0`;
      }
    }
  );
}
