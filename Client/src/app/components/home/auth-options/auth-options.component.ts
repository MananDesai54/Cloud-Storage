import {
  Component,
  ElementRef,
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
export class AuthOptionsComponent implements OnInit {
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
  }

  onSignOut() {
    this.authService.signOut();
  }
}
