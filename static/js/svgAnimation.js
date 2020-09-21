const logo = document.querySelectorAll('#logo > path');

logo.forEach(path=>{
    console.log(path.getTotalLength())
});

const svgAnime = gsap.timeline();

svgAnime.to('.splash-screen',{
    duration:0.5,
    opacity:0,
    delay:4,
}).to('.splash-screen',{
    zIndex:-100
})