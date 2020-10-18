import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  isNavOpen: boolean;

  constructor(private cloudService: CloudService) {}

  ngOnInit(): void {
    this.subscription = this.cloudService.navToggle.subscribe(
      (isOpen: boolean) => {
        this.isNavOpen = isOpen;
        console.log(isOpen);
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
