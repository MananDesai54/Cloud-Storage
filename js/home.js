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