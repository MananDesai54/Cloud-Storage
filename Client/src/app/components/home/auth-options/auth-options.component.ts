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
import { take } from 'rxjs/operators';

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
    this.authService
      .signInWithSocialMedia(method)
      .pipe(take(1))
      .subscribe((user) => {
        this.user = user;
        this.setUserCredential();
      });
  }

  onSignOut() {
    this.authService.signOut();
  }
  setUserCredential() {
    this.userCredential = {
      email: this.user.email,
      username: this.user.name,
      method: this.user.provider.toLowerCase(),
      id: this.user.id,
      profileUrl: this.user.photoUrl,
    };
    this.authService.registerUser(this.userCredential);
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
