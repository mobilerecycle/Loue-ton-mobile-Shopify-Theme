theme.accordion = (function() {
  function accordionBody(e) { 
    let faqContainer = e.querySelectorAll('.faq__list--item__button');
    faqContainer.forEach(function (list) {
      list.addEventListener("click", function (event) {
          let singleFaqItem = list.closest('.faq__list--item'),
              singleFaqItemBody = singleFaqItem.querySelector('.faq__body');
        
       		singleFaqItem.addEventListener(
                  "transitionend",
                  () => {
                    trapFocus(singleFaqItem);
                  },
                  { once: true }
             );
      
      		singleFaqItem.addEventListener("keyup", (evt) => {
              if (evt.code === "Escape") {
                singleFaqItem.classList.remove("active");
                slideUp(singleFaqItemBody);
                removeTrapFocus(singleFaqItem);
              }
            });
        
          if (singleFaqItem.classList.contains("active")) {
            singleFaqItem.classList.remove("active");
            slideUp(singleFaqItemBody);            
        
          } else {
            singleFaqItem.classList.add("active");
            slideDown(singleFaqItemBody);
            getSiblings(singleFaqItem).forEach(function (list) {
              let sibllingSingleAccordionBody = list.querySelector('.faq__body');
              list.classList.remove("active");
              slideUp(sibllingSingleAccordionBody);
            });
          }
      });
      
    });
  }
  return accordionBody;
})();
