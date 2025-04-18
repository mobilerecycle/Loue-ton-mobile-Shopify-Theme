if (!customElements.get("cart-action-popup")) {
  customElements.define(
    "cart-action-popup",
    class CartActionPopup extends HTMLElement {
      constructor() {
        super();

        this.button = this.querySelector(".cart_notification_action_button");
        this.CancelButtons = this.querySelectorAll(".button__cancel");
        this.SaveButtons = this.querySelectorAll(".button__save");
        this.actionOverlay = this.closest("cart-notification").querySelector(
          ".cart_action_drawer_overlay"
        );
        this.cartNote = this.querySelector("#cart_note_drawer");
        this.cartNoteValue = this.querySelector("#cartNote");
        this.shippingDrawer = this.querySelector("#shipping_drawer");

        this.shippingCountry = this.querySelector("#AddressCountry_Shipping");
        this.countryState = this.querySelector("#AddressProvince_shipping");
        this.shippingCountryZip = this.querySelector("#ShippingAddressZip");

        this.actions = {
          note: "note",
          shipping: "shipping",
        };

        this.button?.addEventListener("click", (event) => {
          event.preventDefault();
          if (this.button.dataset.action === this.actions.note) {
            this.open();
            this.cartNote.classList.add("active");
          } else if (this.button.dataset.action === this.actions.shipping) {
            this.open();
            this.shippingDrawer.classList.add("active");
          }

          if (this.cartNoteValue) {
            fetch("/cart.js")
              .then((response) => response.json())
              .then((json) => {
                this.cartNoteValue.value = json.note;
              })
              .catch((err) => console.log(err));
          }
          if (this.shippingCountry && this.countryState) {
            if (Shopify && Shopify.CountryProvinceSelector) {
              new Shopify.CountryProvinceSelector(
                "AddressCountry_Shipping",
                "AddressProvince_shipping",
                {
                  hideElement: "AddressProvinceContainerNewShiping",
                }
              );
            }
          }
        });

        // Close buttons
        this.CancelButtons.forEach((button) => {
          button?.addEventListener("click", this.close.bind(this));
        });

        // Save buttons
        this.SaveButtons.forEach((button) => {
          button?.dataset.action === "note" &&
            button?.addEventListener(
              "click",
              this.saveCartNote.bind(this, button)
            );
          button?.dataset.action === "shipping" &&
            button?.addEventListener(
              "click",
              this.shippingCalc.bind(this, button)
            );
        });
      }

      open() {
        this.actionOverlay.classList.add("active");
      }

      close() {
        this.actionOverlay.classList.remove("active");
        this.cartNote?.classList.contains("active")
          ? this.cartNote.classList.remove("active")
          : null;
        this.shippingDrawer?.classList.contains("active")
          ? this.shippingDrawer.classList.remove("active")
          : null;
      }

      saveCartNote(button) {
        button.classList.add("loading");
        let body = JSON.stringify({
          note: this.cartNoteValue.value,
        });
        fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
          .then((response) => {
            return response.json();
          })
          .then((state) => {
            console.log(state);
            this.cartNote.classList.remove("active");
            this.actionOverlay.classList.remove("active");
            button.classList.remove("loading");
          })
          .catch((e) => {
            // console.error(e);
          });
      }

      shippingCalc(button) {
        this.shippingRatePackage = this.querySelector(".shipping_rate_package");
        this.shippingAddressWrapper = this.querySelector(
          ".shipping_rate_message"
        );
        this.shippingAddressCount = this.querySelector(
          ".shipping_address_count"
        );

        this.shippingRatePackage.innerHTML = "";
        if (this.shippingCountry.value !== "---") {
          button.classList.add("loading");
          fetch(
            `/cart/shipping_rates.json?shipping_address%5Bzip%5D=${this.shippingCountryZip.value}&shipping_address%5Bcountry%5D=${this.shippingCountry.value}&shipping_address%5Bprovince%5D=${this.countryState.value}`
          )
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw `${window.shipping.wrong_message}`;
              }
            })
            .then((response) => {
              button.classList.remove("loading");

              this.shippingAddressWrapper.classList.remove("no-js-inline");
              this.shippingAddressCount.innerText = `${response.shipping_rates.length}`;
              response.shipping_rates.map((item) => {
                let text = document.createElement("P");
                text.setAttribute("class", "mb-0");
                text.innerText = `${item.name}: ${shopCurrencySymbol}${item.price}`;
                this.shippingRatePackage.appendChild(text);
              });
            })
            .catch((e) => {
              button.classList.remove("loading");
              this.shippingAddressWrapper.classList.add("no-js-inline");
              this.shippingRatePackage.innerHTML = `<p class="error mt-15">${e}</p>`;
            });
        } else {
          this.shippingAddressWrapper.classList.add("no-js-inline");
          this.shippingRatePackage.innerHTML = `<p class="error mt-15">${window.shipping.country_label}</p>`;
        }
      }
    }
  );
}
