const email = document.getElementById('email');
const password = document.getElementById('password');
const submitBtn = document.getElementById('signUpBtn');

const validation = {
    email:false,
    password:false
}

email.addEventListener('input',(e)=>{
    if(e.target.value.trim() === ''){
        validation.email = false;
    }else {
        validation.email = true;
    }
    checkValidation();
})

password.addEventListener('input',(e)=>{
    if(e.target.value.trim() === ''){
        validation.password = false;
    }else {
        validation.password = true;
    }
    checkValidation();
})

function checkValidation() {
    let isValidate = true;
    for(let val in validation) {
        isValidate = validation[val] && isValidate;
    }
    if(isValidate) {
        submitBtn.disabled = false;
    }else {
        submitBtn.disabled = true;
    }
}