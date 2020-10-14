import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUserCredential } from 'src/app/models/userCredential.model';
import { AuthService } from '../../../services/auth.service';
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
  @ViewChild('emailInput') emailInput: ElementRef;
  previousEmailValue = '';
  validations: Validation[];
  signUpForm: FormGroup;
  userData: IUserCredential;

  constructor(
    private signupService: SignupService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.validations = this.signupService.getValidations();
    this.signUpForm = new FormGroup({
      username: new FormControl(null),
      email: new FormControl(null, [], this.emailExistsValidation.bind(this)),
      password: new FormControl(null),
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.signUpForm.value;
    this.authService
      .registerUser({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        method: 'local',
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.signUpForm.reset();
        },
        (error) => {
          console.log(error);
        }
      );
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
  onSignUpWithSocialAccount(method) {
    this.authService.signInWithSocialMedia(method);
  }
  emailExistsValidation(
    control: FormControl
  ): Promise<any> | Observable<any> | any {
    return new Promise((resolve, reject) => {
      // fetch(`http://localhost:5000/api/auth/${control.value}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log(data);
      //     if (data.found) {
      //       resolve({ EmailExist: true });
      //     } else {
      //       resolve(null);
      //     }
      //   });
    });
  }
}
