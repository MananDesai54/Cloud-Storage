const form = document.getElementById('signUp-form');
const nameInput = document.getElementById('name');
const email = document.getElementById('emailId');
const password = document.getElementById('password');
const submitBtn = document.getElementById('signUpBtn');

const validated = {
    name:false,
    email:false,
    password:false
}

const passwordCheck = {
    length:false,
    capital:false,
    small:false,
    number:false,
    special:false
}

function checkDisabled() {
    let visibleSubmit = true;
    for(let val in validated) {
        visibleSubmit = validated[val] && visibleSubmit;
    }
    if(visibleSubmit) {
        submitBtn.disabled = false; 
        submitBtn.title = 'Submit to Register';
    }else {
        submitBtn.disabled = true;
        submitBtn.title = 'Please fill the form';
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
});

nameInput.addEventListener('input',(e)=>{
    validate(e.target,e.target.id);
});
email.addEventListener('input',(e)=>{
    validate(e.target,e.target.id);
});
password.addEventListener('input',(e)=>{
    validate(e.target,e.target.id);
});

function validate(element,field) {
    const value = element.value.trim();
    const errorBox = element.parentElement.querySelector('small');
    if(field === 'name') {
        if(value.length < 5) {
            danger('name',element,errorBox);
        }else {
            success('name',element,errorBox);
        }
    }else if(field === 'emailId') {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        let isValid = re.test(element.value);
        if(!isValid) {
            danger('email',element,errorBox);
        }else {
            success('email',element,errorBox);
        }
    }else if(field === 'password') {
        const passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_=+-/<>?`~:])[A-Za-z\d!@#$%^&*_=+-/<>?`~:]{8,32}$/g;
        const capitalTest = /[A-Z]+/;
        const smallTest = /[a-z]+/;
        const numberTest = /[0-9]+/;
        const specialTest = /[!@#$%^&*_=+-/<>?`~:]+/;

        const lengthCheck = document.getElementById('length-check');
        //length check
        if(element.value.length >= 8 && element.value.length<=32) {
            lengthCheck.classList.add('success');
            passwordCheck.length = true;
        }else {
            lengthCheck.classList.remove('success');
            passwordCheck.length = false;
        }

        const capitalCheck = document.getElementById('capital-check');
        //Capital check
        passwordValidate(capitalTest,element,capitalCheck,'capital');
        
        const smallCheck = document.getElementById('small-check');
        //Small check
        passwordValidate(smallTest,element,smallCheck,'small');
        
        const numberCheck = document.getElementById('number-check');
        //Number check
        passwordValidate(numberTest,element,numberCheck,'number');
        
        const specialCheck = document.getElementById('special-check');
        //Special check
        passwordValidate(specialTest,element,specialCheck,'special');
        if(passwordTest.test(element.value)) {
            element.classList.add('success');
            element.classList.remove('danger');
            validated.password = true;
            checkDisabled();
        }else {
            element.classList.remove('success');
            element.classList.add('danger');
            validated.password = false;
            checkDisabled();
        }
    }
}

function danger(ele,element,errorBox) {
    element.classList.add('danger');
    element.classList.remove('success');
    errorBox.classList.add('danger');
    validated[ele] = false;
    checkDisabled();
}
function success(ele,element,errorBox) {
    element.classList.remove('danger');
    element.classList.add('success');
    errorBox.classList.remove('danger');
    validated[ele] = true;
    checkDisabled();
}

function passwordValidate(re,element,messageBox,type) {
    if(re.test(element.value)) {
        messageBox.classList.add('success');
        passwordCheck[type] = true;
    }else {
        messageBox.classList.remove('success');
        passwordCheck[type] = false;
    }
}