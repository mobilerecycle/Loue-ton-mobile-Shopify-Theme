if (!customElements.get("age-verifier-popup")) {
  customElements.define(
    "age-verifier-popup",
    class AgeVerifyPopup extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.popup = this;
        this.cookieName = "mavon:age-verifier";
        this.agreeButton = this.querySelector(".confirm--age-button");
        this.agreeButton?.addEventListener("click", this.closePopup.bind(this));

        this.cancelButton = this.querySelector(".cancel--age-button");
        this.cancelButton?.addEventListener(
          "click",
          this.togglePopup.bind(this)
        );

        this.goBackButton = this.querySelector(".go-back--age-button");
        this.goBackButton?.addEventListener(
          "click",
          this.cancelPopup.bind(this)
        );

        this.mainPopup = this.querySelector("#age-verification-main-popup");
        this.failedPopup = this.querySelector("#age-verification-failed-popup");

        this.hidePopup();
      }

      togglePopup() {
        this.mainPopup.classList.add("hidden");
        this.failedPopup.classList.remove("hidden");
      }

      cancelPopup() {
        this.mainPopup.classList.remove("hidden");
        this.failedPopup.classList.add("hidden");
      }

      closePopup() {
        this.popup.classList.remove("open--popup");
        document.body.classList.remove("overflow-hidden");
        this.setCookie(this.cookieName, this.dataset.expire);
      }

      hidePopup() {
        if (
          JSON.parse(
            this.getCookie(this.cookieName) && this.dataset.display === "enable"
          )
        ) {
          this.popup.classList.remove("open--popup");
          document.body.classList.remove("overflow-hidden");
        } else {
          this.popup.classList.add("open--popup");
          document.body.classList.add("overflow-hidden");
        }
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
    }
  );
}
