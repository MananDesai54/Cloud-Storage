import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CloudComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // this.subscription = this.authService.user.subscribe((user) => {
    //   this.authService
    //     .authUser()
    //     .pipe(take(1))
    //     .subscribe(
    //       (res) => console.log(res),
    //       (err) => console.log(err)
    //     );
    // });
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  onLogout() {
    this.authService.logout();
  }
}
