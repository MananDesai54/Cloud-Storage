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
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('options') options: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  subscription: Subscription;
  authSubscription: Subscription;
  isNavOpen: boolean;
  user: User;
  toggleAvatarOption = false;
  isModalOpen = false;
  selectedField: string;
  selectedType: string;
  selectedValue: string;
  isLoading = false;
  message: any;
  success: boolean;

  constructor(
    private cloudService: CloudService,
    private authService: AuthService,
    private profileService: ProfileService
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

  onToggleAvatarOptions() {
    this.toggleAvatarOption = !this.toggleAvatarOption;
  }
  onSideMenuToggle() {
    this.options.nativeElement.classList.toggle('toggle-side-menu');
    this.backdrop.nativeElement.classList.toggle('backdrop-show');
  }
  onBackdropClick() {
    this.onSideMenuToggle();
  }
  onChangeAvatar() {
    this.fileInput.nativeElement.click();
    this.onToggleAvatarOptions();
  }
  onDeleteAvatar() {
    this.onToggleAvatarOptions();
  }
  onEditField(field: string, type: string, value?: string) {
    this.isModalOpen = true;
    this.selectedField = field;
    this.selectedType = type;
    this.selectedValue = value;
  }
  onSendVerificationMail() {
    this.profileService
      .sendEmailVerificationMail(this.user.email.value)
      .subscribe(
        (res) => {
          console.log(res);
          this.setSuccess('Mail sent');
        },
        (error) => {
          console.log(error);
          this.message = 'Something went wrong';
        }
      );
  }
  onCloseModal(success: boolean) {
    if (success) {
      this.setSuccess(`${this.selectedField} Updated Successfully`);
    }
    this.isModalOpen = false;
  }

  onLogout() {
    this.authService.logout();
  }
  onDeleteAccount() {
    alert('Are you sure?');
  }

  private setSuccess(message) {
    this.success = true;
    this.message = message;
    setTimeout(() => {
      this.message = '';
      this.success = false;
    }, 5000);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
