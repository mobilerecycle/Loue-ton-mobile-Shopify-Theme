const scrollTop = document.getElementById('scroll__top');

scrollTop.addEventListener('click', function(){
  window.scroll({top: 0, left: 0, behavior: 'smooth'});
}) 

window.addEventListener('scroll', function(){
  if(window.scrollY > 300 ){  
    scrollTop.classList.add("active");
  }else{
    scrollTop.classList.remove("active");
  }
}) 