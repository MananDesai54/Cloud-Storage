import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CloudComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // this.subscription = this.authService.user.subscribe((user) => {
    this.subscription = this.authService
      .authUser()
      .pipe(take(1))
      .subscribe(
        (userData) => {
          this.profileService.findMe(userData);
        },
        (error) => {
          console.log(error);
          this.authService.logout();
        }
      );
    // });
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  onLogout() {
    this.authService.logout();
  }
}
