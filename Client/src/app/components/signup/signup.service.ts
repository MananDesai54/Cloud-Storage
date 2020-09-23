import { ElementRef, Injectable } from '@angular/core';
import { Validation } from './validation.model';

@Injectable()
export class SignupService {
    validated = {
        name: false,
        email: false,
        password: false
    };
    passwordCheck = {
        length: false,
        capital: false,
        small: false,
        number: false,
        special: false
    };
    validations = [
        new Validation(' ▪ Length must be between 8-16 letters', false, 'length-check'),
        new Validation(' ▪ At least 1 Capital Letter', false, 'capital-check'),
        new Validation(' ▪ At least 1 Small Letter', false, 'small-check'),
        new Validation(' ▪ At least 1 Number', false, 'number-check'),
        new Validation(' ▪ At least 1 Special Character', false, 'special-check')
    ];
    submitBtn: ElementRef;
    setSubmitBtn(submitBtn: ElementRef) {
        this.submitBtn = submitBtn;
    }

    validate(element: HTMLInputElement, field: string) {
        const value = element.value.trim();
        const errorBox = element.parentElement.querySelector('small');
        if(field === 'name') {
            if(value.length < 5) {
                this.danger('name',element,errorBox);
            }else {
                this.success('name',element,errorBox);
            }
        }else if(field === 'email') {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            let isValid = re.test(element.value);
            if(!isValid) {
                this.danger('email',element,errorBox);
            }else {
                this.success('email',element,errorBox);
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
                this.passwordCheck.length = true;
                this.validations.find((validation: Validation) => validation.id === 'length-check').done = true;
            }else {
                lengthCheck.classList.remove('success');
                this.passwordCheck.length = false;
                this.validations.find((validation: Validation) => validation.id === 'length-check').done = false;
            }

            const capitalCheck = document.getElementById('capital-check');
            //Capital check
            this.passwordValidate(capitalTest,element,capitalCheck,'capital');
            
            const smallCheck = document.getElementById('small-check');
            //Small check
            this.passwordValidate(smallTest,element,smallCheck,'small');
            
            const numberCheck = document.getElementById('number-check');
            //Number check
            this.passwordValidate(numberTest,element,numberCheck,'number');
            
            const specialCheck = document.getElementById('special-check');
            //Special check
            this.passwordValidate(specialTest,element,specialCheck,'special');
            if(passwordTest.test(element.value)) {
                element.classList.add('success');
                element.classList.remove('danger');
                this.validated.password = true;
                this.checkDisabled();
            }else {
                element.classList.remove('success');
                element.classList.add('danger');
                this.validated.password = false;
                this.checkDisabled();
            }
        }
    }

    checkDisabled() {
        let visibleSubmit = true;
        for(let val in this.validated) {
            visibleSubmit = this.validated[val] && visibleSubmit;
        }
        if(visibleSubmit) {
            this.submitBtn.nativeElement.disabled = false;
            this.submitBtn.nativeElement.title = 'Submit to Register';
        }else {
            this.submitBtn.nativeElement.disabled = true;
            this.submitBtn.nativeElement.title = 'Please fill the form';
        }
    }

    passwordValidate(re,element,messageBox,type) {
        if(re.test(element.value)) {
            messageBox.classList.add('success');
            this.passwordCheck[type] = true;
            this.validations.find((validation: Validation) => validation.id === `${type}-check`).done = true;
        }else {
            messageBox.classList.remove('success');
            this.passwordCheck[type] = false;
            this.validations.find((validation: Validation) => validation.id === `${type}-check`).done = true;
        }
    }
    danger(ele,element,errorBox) {
        element.classList.add('danger');
        element.classList.remove('success');
        errorBox.classList.add('danger');
        this.validated[ele] = false;
        this.checkDisabled();
    }
    success(ele,element,errorBox) {
        element.classList.remove('danger');
        element.classList.add('success');
        errorBox.classList.remove('danger');
        this.validated[ele] = true;
        this.checkDisabled();
    }
}
