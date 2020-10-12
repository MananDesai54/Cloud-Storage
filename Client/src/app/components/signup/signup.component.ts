import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SignupService } from './signup.service';
import { Validation } from './validation.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [
    './signup.component.css'
  ],
  providers: [
    SignupService
  ]
})
export class SignupComponent implements OnInit {
  @Input() isHome: boolean;
  @ViewChild('submitBtn') submitBtn: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  validations: Validation[];

  constructor(private signupService: SignupService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.validations = this.signupService.getValidations();
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }
  onInput(event: any) {
    this.signupService.setSubmitBtn(this.submitBtn);
    this.signupService.validate(event.target, event.target.id);
  }
  showHide(event: any) {
    event.target.classList.toggle('hide');
    if(this.passwordInput.nativeElement.type === 'text') {
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
