import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../signup/signup.component.css'],
  providers: [LoginService],
})
export class LoginComponent implements OnInit {
  @ViewChild('submitBtn') submitBtn: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;
  loginForm: FormGroup;
  isEmailExist = false;
  isLoading = false;
  errorMessage: any;

  constructor(
    private loginService: LoginService,
    private authService: AuthService
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

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.loginForm.controls);
  }

  checkEmailExist() {
    const email = this.loginForm.get('email').value;
    this.isLoading = true;
    this.authService.checkEmailExist(email).subscribe(
      (res) => {
        this.isLoading = false;
        console.log(res);
        this.isEmailExist = true;
        this.emailInput.nativeElement.disabled = true;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
        console.log(error);
        this.loginForm.patchValue({ email: '' });
      }
    );
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
}
