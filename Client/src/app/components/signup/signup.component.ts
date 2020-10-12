import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SignupService } from './signup.service';
import { Validation } from './validation.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService],
})
export class SignupComponent implements OnInit {
  @Input() isHome: boolean;
  @ViewChild('submitBtn') submitBtn: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  validations: Validation[];
  signUpForm: FormGroup;

  constructor(
    private signupService: SignupService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.validations = this.signupService.getValidations();
    this.signUpForm = new FormGroup({
      username: new FormControl(null, [], this.emailExistsValidation),
      email: new FormControl(null),
      password: new FormControl(null),
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.signUpForm.controls);
  }
  onInput(event: any) {
    this.signupService.setSubmitBtn(this.submitBtn);
    this.signupService.validate(event.target, event.target.id);
  }
  showHide(event: any) {
    event.target.classList.toggle('hide');
    if (this.passwordInput.nativeElement.type === 'text') {
      this.passwordInput.nativeElement.type = 'password';
    } else {
      this.passwordInput.nativeElement.type = 'text';
    }
  }
  onSignUpWithGoogle() {
    this.authService.signInWithGoogle();
  }
  onSignUpWithFacebook() {
    this.authService.signInWithFacebook();
  }
  emailExistsValidation(
    control: FormControl
  ): Promise<any> | Observable<any> | any {
    return new Promise((resolve, reject) => {
      // api call to check email exists
    });
  }
}
