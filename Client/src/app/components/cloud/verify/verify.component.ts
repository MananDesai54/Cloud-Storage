import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  emailSubscription: Subscription;
  userSubscription: Subscription;
  user: User;
  message: string;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => console.log(error)
    );
  }
  onSendVerificationMail() {
    this.emailSubscription = this.profileService
      .sendEmailVerificationMail(this.user.email.value)
      .subscribe(
        (res) => {
          console.log(res);
          this.message = 'Mail sent';
          setTimeout(() => {
            this.message = '';
          }, 5000);
        },
        (error) => {
          console.log(error);
          this.message = 'Something went wrong';
          setTimeout(() => {
            this.message = '';
          }, 5000);
        }
      );
  }
  ngOnDestroy() {
    this.emailSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
