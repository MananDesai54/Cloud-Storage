import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { ILoginCredential } from 'src/app/models/loginCredential.model';
import { AuthService } from '../../../services/auth.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../signup/signup.component.css'],
  providers: [LoginService],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('submitBtn') submitBtn: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;
  loginForm: FormGroup;
  isEmailExist = false;
  isLoading = false;
  errorMessage: any;
  subscription: Subscription;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  onInput(event: any) {
    this.loginService.setSubmitBtn(this.submitBtn);
    this.loginService.validate(event.target, event.target.id);
  }

  showHide(event: any) {
    event.target.classList.toggle('hide');
    if (
      this.passwordInput.nativeElement.type === 'text' &&
      this.passwordInput
    ) {
      this.passwordInput.nativeElement.type = 'password';
    } else {
      this.passwordInput.nativeElement.type = 'text';
    }
  }

  checkEmailExist() {
    const email = this.loginForm.get('email').value;
    this.isLoading = true;
    this.subscription = this.authService.checkEmailExist(email).subscribe(
      (res) => {
        this.isLoading = false;
        this.isEmailExist = true;
        this.emailInput.nativeElement.disabled = true;
      },
      (error) => {
        this.setError(error);
        this.resetStuff();
      }
    );
  }

  onLoginWithSocialAccount(method) {
    this.authService.signInWithSocialMedia(method, true);
    this.isLoading = true;
    this.subscription = this.authService.socialUserSubject.subscribe(
      (user: SocialUser) => {
        this.resetStuff();
        this.authService
          .loginUser({
            email: user.email,
            method: user.provider.toLowerCase(),
            id: user.id,
          })
          .subscribe(
            (res) => {
              this.isLoading = false;
              this.router.navigate(['/cloud']);
            },
            (error) => {
              this.isLoading = false;
              this.setError(error);
            }
          );
      },
      (error) => {
        this.resetStuff();
        console.log(error);
      }
    );
  }

  onSubmit(event: Event) {
    if (this.loginForm.value.password) {
      this.isLoading = true;
      this.subscription = this.authService
        .loginUser({
          email: this.loginForm.value.email,
          method: 'local',
          password: this.loginForm.value.password,
        })
        .subscribe(
          (res) => {
            this.resetStuff();
            this.router.navigate(['/cloud']);
          },
          (error) => {
            console.log(error);
            this.setError(error);
            this.resetStuff();
            this.isEmailExist = false;
          }
        );
    }
  }

  private resetStuff() {
    this.isLoading = false;
    this.loginForm.reset();
    this.emailInput.nativeElement.disabled = false;
  }

  private setError(error) {
    this.errorMessage = error;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
