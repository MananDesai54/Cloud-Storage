import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.css'],
})
export class CloudComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      console.log(user);
      this.authService.authUser().subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
    });
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
