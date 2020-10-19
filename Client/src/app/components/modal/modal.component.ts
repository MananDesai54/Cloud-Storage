import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() input: { field: string; type: string; value: string };
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('modal', { static: true }) modal: ElementRef;
  @ViewChild('backdrop', { static: true }) backdrop: ElementRef;
  updateProfileForm: FormGroup;
  isLoading: false;

  constructor() {}

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
      currentPassword: new FormControl(null, Validators.required),
    });
  }

  onCloseModal() {
    this.backdrop.nativeElement.classList.add('hide');
    this.modal.nativeElement.classList.add('close');
    setTimeout(() => {
      this.closeModal.emit();
    }, 500);
  }

  onUpdate() {
    console.log(this.updateProfileForm.value);
  }
}
