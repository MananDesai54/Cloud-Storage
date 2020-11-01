import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { Observable, Subscription } from 'rxjs';
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
export class SignupComponent implements OnInit, OnDestroy {
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
  errorMessage: any;
  subscription: Subscription;

  constructor(
    private signupService: SignupService,
    private authService: AuthService,
    private router: Router
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
    this.subscription = this.authService
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
          this.router.navigate(['/cloud']);
        },
        (error) => {
          this.setError(error);
          this.resetForm();
        }
      );
  }

  onSignUpWithSocialAccount(method) {
    this.authService.signInWithSocialMedia(method);
    // this.isLoading = true;
    this.subscription = this.authService.socialUserSubject.subscribe(
      (user: SocialUser) => {
        this.authService
          .registerUser({
            email: user.email,
            username: user.name,
            method: user.provider.toLowerCase(),
            profileUrl: user.photoUrl,
            id: user.id,
          })
          .subscribe(
            (res) => {
              this.isLoading = false;
              console.log(res);
              this.router.navigate(['/cloud']);
            },
            (error) => {
              this.isLoading = false;
              this.setError(error);
            }
          );
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  private resetForm() {
    this.signUpForm.reset();
    this.validations.forEach((validation) => {
      validation.done = false;
    });
    this.emailInput.nativeElement.classList.remove('success');
    this.passwordInput.nativeElement.classList.remove('success');
    this.usernameInput.nativeElement.classList.remove('success');
    this.submitBtn.nativeElement.disabled = true;
  }

  private setError(error) {
    this.isLoading = false;
    this.errorMessage = error;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
    console.log(error);
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
