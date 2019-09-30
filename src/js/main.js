window.onload = () => {
  
  //  menu hamburger
  let button = document.querySelector('.hamburger');
  let nav = document.querySelector('.menu .menu__list');

  button.addEventListener('click', function() {
    this.classList.toggle('hamburger--active');
    nav.classList.toggle('menu__list--active')
  });


};