import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { AuthService } from '../../../services/auth.service';
import { IUserCredential } from '../../../models/userCredential.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-options',
  templateUrl: './auth-options.component.html',
  styleUrls: ['./auth-options.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthOptionsComponent implements OnInit, OnDestroy {
  @ViewChild('cards', { static: true }) cards: ElementRef;
  @ViewChild('signupForm', { static: true }) signupForm: ElementRef;
  user: SocialUser;
  userCredential: IUserCredential;
  subscription: Subscription;
  isLoading = false;
  errorMessage: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  onEmailAndPassword() {
    this.cards.nativeElement.classList.add('go-left');
    this.signupForm.nativeElement.classList.remove('go-right');
  }
  onBackBtnClick() {
    this.cards.nativeElement.classList.remove('go-left');
    this.signupForm.nativeElement.classList.add('go-right');
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
              console.log(res);
              this.isLoading = false;
              this.router.navigate(['/cloud']);
            },
            (error) => {
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

  setError(error) {
    this.isLoading = false;
    this.errorMessage = error;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
    console.log(error);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
