const menuToggle = $('.menu-toggle');
const menu = $('.menu');

menuToggle.click(() => {
    menuToggle.toggleClass('toggle-move');
    menu.toggleClass('menu-move');
})