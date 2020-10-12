import { 
  Component,
  ElementRef, 
  OnInit, 
  ViewChild, 
  ViewEncapsulation 
} from '@angular/core';
import { 
  SocialAuthService,
  SocialUser
} from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private socialAuthService: SocialAuthService, private authService: AuthService) { }

  ngOnInit(): void {
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.user = user;
    //   console.log(this.user);
    //   fetch('http://localhost:5000/api/users', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       id: user.id,
    //       method: user.provider.toLowerCase(),
    //       username: user.name,
    //       email: user.email,
    //       profileUrl: user.photoUrl
    //     }),
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }).then(res => res.json())
    //     .then(data => console.log(data));
    // })
  }
  onEmailAndPassword() {
    this.cards.nativeElement.classList.add('go-left');
    this.signupForm.nativeElement.classList.remove('go-right');
  }
  onBackBtnClick() {
    this.cards.nativeElement.classList.remove('go-left');
    this.signupForm.nativeElement.classList.add('go-right');
  }
  onSignUpWithGoogle() {
    this.authService.signInWithGoogle();
  }
  onSignUpWithFacebook() {
    this.authService.signInWithFacebook();
  }
  onSignOut() {
    this.authService.signOut();
  }

}
