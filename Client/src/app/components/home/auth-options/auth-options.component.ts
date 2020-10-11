import { 
  Component,
  ElementRef, 
  OnInit, 
  ViewChild, 
  ViewEncapsulation 
} from '@angular/core';
import { 
  SocialAuthService,
  SocialUser,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';

@Component({
  selector: 'app-auth-options',
  templateUrl: './auth-options.component.html',
  styleUrls: ['./auth-options.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthOptionsComponent implements OnInit {
  @ViewChild('cards', { static: true }) cards: ElementRef;
  @ViewChild('signupForm', { static: true }) signupForm: ElementRef;
  user: SocialUser;

  constructor(private _authService: SocialAuthService) { }

  ngOnInit(): void {
    this._authService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
    })
  }
  onEmailAndPassword() {
    this.cards.nativeElement.classList.add('go-left');
    this.signupForm.nativeElement.classList.remove('go-right');
  }
  onBackBtnClick() {
    this.cards.nativeElement.classList.remove('go-left');
    this.signupForm.nativeElement.classList.add('go-right');
  }
  signUpWithGoogle() {
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signUpWithFacebook() {
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
