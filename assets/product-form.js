if (!customElements.get("product-form")) {
  customElements.define(
    "product-form",
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector("form");
        this.variantIdInput.disabled = false;
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.cart = document.querySelector("cart-notification");
        this.cartItems = document.querySelector("cart-items");
        this.quickViewWarpper = document.getElementById("quickViewWrapper");
        //console.log(this.cart);
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector("span");

        this.hideErrors = this.dataset.hideErrors === "true";
      }

      onSubmitHandler(evt) {
        evt.preventDefault();

        const submitButton = this.querySelector('[type="submit"]');

        this.submitButton.setAttribute("disabled", true);
        this.submitButton.classList.add("loading");
        // Get Cart API
        let config = fetchConfig("javascript");
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config.headers["Content-Type"];

        let formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            "sections",
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          this.cart.setActiveElement(document.activeElement);
        }

        if (this.cartItems) {
          formData.append(
            "sections",
            this.cartItems
              .getSectionsToRender()
              .map((section) => section.section)
          );
        }

        formData.append("sections_url", window.location.pathname);
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: "product-form",
                productVariantId: formData.get("id"),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            if (this.cart) {
              this.cart.renderContents(response);
            }

            if (this.cartItems) {
              this.cartItems.renderContents(response);
            }

            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: "product-form",
                productVariantId: formData.get("id"),
                cartData: response,
              });
            this.error = false;

            document
              .querySelector(".product-form__error-message-wrapper")
              ?.classList.add("no-js-inline");
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove("loading");
            this.submitButton.removeAttribute("disabled");
            this.quickViewWarpper?.classList.remove("show__modal");
            document.body.classList.remove("overflow-hidden");
          });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );
        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
          this.errorMessageWrapper.classList.remove("no-js-inline");
        }
      }

      toggleSubmitButton({ disable = true, text, isPreorder = false }) {
        if (disable) {
          this.submitButton.setAttribute("disabled", "disabled");
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute("disabled");
          this.submitButtonText.textContent = isPreorder
            ? window.variantStrings.preorder
            : window.variantStrings.addToCart;
        }
      }

      get variantIdInput() {
        return this.form.querySelector("[name=id]");
      }
    }
  );
}
