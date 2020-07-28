const signUpWithEmail = document.getElementById('email');
const cards = document.querySelector('.cards');

signUpWithEmail.addEventListener('click',(e)=>{
    cards.classList.add('go-left');
})