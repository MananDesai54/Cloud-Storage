import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class LoginService {
  private validation = {
    email: false,
    password: false,
  };
  private submitBtn: ElementRef;
  setSubmitBtn(btn: ElementRef) {
    this.submitBtn = btn;
  }

  validate(element: HTMLInputElement, type: string) {
    if (element.value.trim() === '') {
      this.validation[type] = false;
    } else if (type === 'email') {
      this.validation.email = true;
    } else if (type === 'password') {
      this.validation.password = true;
    }
    this.checkValidation();
  }

  checkValidation() {
    let isValidate = true;
    // tslint:disable-next-line: forin
    for (const val in this.validation) {
      isValidate = this.validation[val] && isValidate;
    }
    if (this.submitBtn) {
      if (isValidate) {
        this.submitBtn.nativeElement.disabled = false;
      } else {
        this.submitBtn.nativeElement.disabled = true;
      }
    }
  }
}
