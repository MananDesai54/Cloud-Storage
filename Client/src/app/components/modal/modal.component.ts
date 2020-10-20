import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() input: { field: string; type: string; value: string };
  @Input() user: User;
  @Output() closeModal = new EventEmitter<boolean>();
  @ViewChild('modal', { static: true }) modal: ElementRef;
  @ViewChild('backdrop', { static: true }) backdrop: ElementRef;
  updateProfileForm: FormGroup;
  isLoading = false;
  message: any;
  subscription: Subscription;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.backdrop.nativeElement.classList.remove('hide');
    this.modal.nativeElement.classList.remove('close');

    this.updateProfileForm = new FormGroup({
      [this.input.field]: new FormControl(
        this.input.value,
        this.input.type === 'email'
          ? [Validators.required, Validators.email]
          : Validators.required
      ),
      password: new FormControl(null, Validators.required),
    });
  }

  onCloseModal() {
    this.backdrop.nativeElement.classList.add('hide');
    this.modal.nativeElement.classList.add('close');
    this.emitCloseModal();
  }

  onUpdate() {
    this.isLoading = true;
    this.subscription = this.profileService
      .updateProfile(this.updateProfileForm.value, this.user)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.resetStuff();
          this.emitCloseModal(true);
        },
        (error) => {
          console.log(error);
          this.setMessage(error);
          this.resetStuff();
        }
      );
  }

  private emitCloseModal(success?: boolean) {
    setTimeout(() => {
      this.closeModal.emit(success);
    }, 500);
  }

  private resetStuff() {
    this.isLoading = false;
    this.updateProfileForm.reset();
  }

  private setMessage(error) {
    this.message = error;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
