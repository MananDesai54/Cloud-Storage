import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../signup/signup.component.css'
  ],
  providers: [
    LoginService
  ]
})
export class LoginComponent implements OnInit {
  @ViewChild('submitBtn') submitBtn: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  constructor(private loginService: LoginService, private authService: AuthService) { }

  ngOnInit(): void {
  }
  onInput(event: any) {
    this.loginService.setSubmitBtn(this.submitBtn);
    this.loginService.validate(event.target, event.target.id);
  }
  onSubmit(event: Event) {
    event.preventDefault();
  }
  showHide(event: any) {
    event.target.classList.toggle('hide');
    if (this.passwordInput.nativeElement.type === 'text') {
      this.passwordInput.nativeElement.type = 'password';
    } else {
      this.passwordInput.nativeElement.type = 'text';
    }
  }
  onSignUpWithGoogle() {
    this.authService.signInWithGoogle();
  }
  onSignUpWithFacebook() {
    this.authService.signInWithFacebook();
  }
}
