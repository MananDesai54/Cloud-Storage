const menuToggle = $('.menu-toggle');
const menu = $('.menu');

menuToggle.click(() => {
    menuToggle.toggleClass('toggle-move');
    menu.toggleClass('menu-move');
});

const roller = $('.roller');
const switchBtn = $('.switch');
roller.click(() => {
    switchBtn.toggleClass('toggle-switch');
})