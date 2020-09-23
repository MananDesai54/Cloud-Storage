import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SignupService } from './signup.service';
import { Validation } from './validation.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [
    './signup.component.css'
  ],
  providers: [
    SignupService
  ]
})
export class SignupComponent implements OnInit {
  @Input() isHome: boolean;
  @ViewChild('submitBtn') submitBtn: ElementRef;
  validations: Validation[];

  constructor(private signupService: SignupService) {
  }

  ngOnInit(): void {
    this.validations = this.signupService.validations;
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }
  onInput(event: any) {
    this.signupService.setSubmitBtn(this.submitBtn);
    this.signupService.validate(event.target, event.target.id);
  }
}
