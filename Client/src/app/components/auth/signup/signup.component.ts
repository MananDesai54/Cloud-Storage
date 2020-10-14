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
  @ViewChild('usernameInput') usernameInput: ElementRef;
  previousEmailValue = '';
  validations: Validation[];
  signUpForm: FormGroup;
  userData: IUserCredential;
  isLoading = false;

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

  onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.signUpForm.value;
    this.isLoading = true;
    this.submitBtn.nativeElement.disabled = true;
    this.authService
      .registerUser({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        method: 'local',
      })
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.resetForm();
          console.log(data);
        },
        (error) => {
          this.isLoading = false;
          this.resetForm();
          console.log(error);
        }
      );
  }

  onSignUpWithSocialAccount(method) {
    this.authService.signInWithSocialMedia(method);
  }

  resetForm() {
    this.signUpForm.reset();
    this.validations.forEach((validation) => {
      validation.done = false;
    });
    this.emailInput.nativeElement.classList.toggle('success');
    this.passwordInput.nativeElement.classList.toggle('success');
    this.usernameInput.nativeElement.classList.toggle('success');
    this.submitBtn.nativeElement.disabled = true;
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
