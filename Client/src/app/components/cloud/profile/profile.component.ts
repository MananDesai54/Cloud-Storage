import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from 'src/app/services/cloud.service';
import { ProfileService } from 'src/app/services/profile.service';

const MESSAGES = {
  Invalid: 'Invalid token, Press verify button to resend mail',
  'Not found': 'User not found',
  Already: 'User already verified',
};

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
  routeSubscription: Subscription;
  imageUploadSubscription: Subscription;
  emailSubscription: Subscription;
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
  deleteProfileForm: FormGroup;
  imageUploadForm: FormGroup;
  confirmDelete: boolean;

  constructor(
    private cloudService: CloudService,
    private authService: AuthService,
    private profileService: ProfileService,
    private route: ActivatedRoute
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

    this.deleteProfileForm = new FormGroup({
      password: new FormControl(null, Validators.required),
    });

    this.imageUploadForm = new FormGroup({
      file: new FormControl(null, Validators.required),
    });

    this.authSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        if (Object.keys(params).length > 0) {
          const { email, message, user } = params;
          if (email.toLowerCase() === 'false') {
            this.setMessage(MESSAGES[message], true);
          } else {
            this.profileService.verifyEmail(
              {
                email: {
                  value: this.user.email.value,
                  verified: true,
                },
              },
              this.user
            );
            this.setMessage(MESSAGES[message]);
          }
        }
      }
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
  onEditField(field: string, type: string, value?: string) {
    this.isModalOpen = true;
    this.selectedField = field;
    this.selectedType = type;
    this.selectedValue = value;
  }
  onSendVerificationMail() {
    this.emailSubscription = this.profileService
      .sendEmailVerificationMail(this.user.email.value)
      .subscribe(
        (res) => {
          console.log(res);
          this.setMessage('Mail sent');
        },
        (error) => {
          console.log(error);
          this.message = 'Something went wrong';
        }
      );
  }
  onCloseModal(success: boolean) {
    if (success) {
      this.setMessage(`${this.selectedField} Updated Successfully`);
    }
    this.isModalOpen = false;
  }

  onLogout() {
    this.authService.logout();
  }
  onDeleteAccount() {
    if (
      !this.confirmDelete &&
      confirm('Are you sure want to delete your account?')
    ) {
      this.confirmDelete = true;
    }
  }
  onConfirmDeleteAccount() {
    this.isLoading = true;
    this.profileService
      .deleteAccount(this.deleteProfileForm.value.password)
      .subscribe(
        (res) => {
          console.log('Profile deleted');
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.setMessage(error, true);
          this.isLoading = false;
        }
      );
  }
  onUploadProfilePhoto(event: any) {
    this.isLoading = true;
    this.imageUploadSubscription = this.profileService
      .uploadProfilePhoto(event.target.files[0], this.user)
      .subscribe(
        (res) => {
          this.setMessage('Profile photo updated');
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.setMessage(error, true);
        }
      );
  }

  onDeleteProfilePhoto() {
    this.isLoading = true;
    this.onToggleAvatarOptions();
    this.imageUploadSubscription = this.profileService
      .deleteAvatar(this.user.profileUrl, this.user)
      .subscribe(
        (res) => {
          this.setMessage('Profile photo deleted');
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.setMessage(error, true);
          this.isLoading = false;
        }
      );
  }

  private setMessage(message, isError?: boolean) {
    if (isError) {
      this.success = false;
    } else {
      this.success = true;
    }
    this.message = message;
    setTimeout(() => {
      this.message = '';
      this.success = false;
    }, 5000);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
    this.imageUploadSubscription?.unsubscribe();
    this.emailSubscription?.unsubscribe();
  }
}
