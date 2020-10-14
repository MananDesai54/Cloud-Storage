import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-social-button',
  templateUrl: './social-button.component.html',
  styleUrls: ['./social-button.component.css'],
})
export class SocialButtonComponent {
  constructor(private authService: AuthService) {}

  onSignUpWithSocialAccount(method) {
    this.authService.signInWithSocialMedia(method);
  }
}
