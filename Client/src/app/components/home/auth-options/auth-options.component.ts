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

  constructor(private authService: AuthService) {}

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
            },
            (error) => {
              console.log(error);
            }
          );
      }
    );
  }

  onSignOut() {
    this.authService.signOut();
  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : '';
  }
}
