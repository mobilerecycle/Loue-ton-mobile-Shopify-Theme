theme.headerSticky = (function() {
  function ScrollSticky(e){
    const headerStickyWrapper = document.querySelector('.header__area');
    const headerStickyTarget = document.querySelector('.header__sticky');
    
    if(headerStickyTarget){
      let headerHeight = headerStickyWrapper.clientHeight;
      window.addEventListener('scroll', function(){
        let StickyTargetElement = TopOffset(headerStickyWrapper);
        let TargetElementTopOffset = StickyTargetElement.top;
        if(window.scrollY > headerHeight ){
          headerStickyTarget.classList.add('sticky');
        }else{
          headerStickyTarget.classList.remove('sticky');
        }
      })
    }
    
    
  }
  return ScrollSticky;
})();


