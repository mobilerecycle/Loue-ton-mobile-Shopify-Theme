let shippingCountry = document.getElementById('AddressCountry_Shipping'),
    countryState = document.getElementById('AddressProvince_shipping'),
    shippingCountryZip = document.getElementById('ShippingAddressZip'),
    shippingRatePackage = document.querySelector('.shipping_rate_package'),
    shippingAddressWrapper = document.querySelector('.shipping_rate_message'),
    shippingAddressCount = document.querySelector('.shipping_address_count'),
    item = document.querySelector('.shipping_calc_save'),
    countrySelectsShipping = document.querySelectorAll('data-address-country-select');

if (Shopify && Shopify.CountryProvinceSelector) {
  new Shopify.CountryProvinceSelector('AddressCountry_Shipping', 'AddressProvince_shipping', {
    hideElement: 'AddressProvinceContainerNewShiping'
  });
}

item.addEventListener('click', () => {
shippingRatePackage.innerHTML = '';
 if(shippingCountry.value !== "---"){
  item.classList.add('loading');  
  fetch(`/cart/shipping_rates.json?shipping_address%5Bzip%5D=${shippingCountryZip.value}&shipping_address%5Bcountry%5D=${shippingCountry.value}&shipping_address%5Bprovince%5D=${countryState.value}`)
  .then((response) => {
    if (response.ok) {
      return response.json()
    } else {
      throw `${window.shipping.wrong_message}`;
    }
  })
  .then((response) => {
    item.classList.remove('loading'); 

    shippingAddressWrapper.classList.remove('no-js-inline');
    shippingAddressCount.innerText = `${response.shipping_rates.length}`
    response.shipping_rates.map((item) => {
      let text = document.createElement("P"); 
      text.setAttribute("class", 'mb-0');
      text.innerText = `${item.name}: ${shopCurrencySymbol}${item.price}`
      shippingRatePackage.appendChild(text);
    })
  })
  .catch((e) => {
    item.classList.remove('loading');     
    shippingAddressWrapper.classList.add('no-js-inline');
    shippingRatePackage.innerHTML = `<p class="error mt-15">${e}</p>`;
  });
}else{
  shippingAddressWrapper.classList.add('no-js-inline');
  shippingRatePackage.innerHTML = `<p class="error mt-15">${window.shipping.country_label}</p>`;
}
});