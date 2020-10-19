import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('options') options: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;
  subscription: Subscription;
  authSubscription: Subscription;
  isNavOpen: boolean;
  user: User;

  constructor(
    private cloudService: CloudService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.cloudService.navToggle.subscribe(
      (isOpen: boolean) => {
        this.isNavOpen = isOpen;
      }
    );

    this.authSubscription = this.authService.user.subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => console.log(error)
    );
  }

  onSideMenuToggle() {
    this.options.nativeElement.classList.toggle('toggle-side-menu');
    this.backdrop.nativeElement.classList.toggle('backdrop-show');
  }
  onBackdropClick() {
    this.onSideMenuToggle();
  }
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
