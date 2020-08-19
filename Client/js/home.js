//change mode

const signUpWithEmail = document.getElementById('email');
const cards = document.querySelector('.cards');
const signUpForm = document.querySelector('.signUp');
const backBtn = document.querySelector('.back-btn');

signUpWithEmail.addEventListener('click',()=>{
    cards.classList.add('go-left');
    signUpForm.classList.remove('go-right');
});

backBtn.addEventListener('click',()=>{
    cards.classList.remove('go-left');
    signUpForm.classList.add('go-right');
})


//Intersection observer
const HowToAnimation = document.querySelector('#how-to-use .feature__animation');
const cardData = document.querySelectorAll('.card__data');

const intersection = new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
        if(entry.target.id === 'feature-animation') {
            if(entry.isIntersecting) {
                entry.target.classList.add('animation');
            }else {
                entry.target.classList.remove('animation');
            }
        }else if(entry.target.id.includes('card__data')) {
            if(entry.isIntersecting) {
                entry.target.classList.add('show');
                intersection.unobserve(entry.target);
            }
        }
    })
},{
    threshold:0,
    rootMargin:'-100px'
});

intersection.observe(HowToAnimation);
cardData.forEach(card=>{
    intersection.observe(card);
})