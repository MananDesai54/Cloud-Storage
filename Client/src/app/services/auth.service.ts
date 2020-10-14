import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserCredential } from '../models/userCredential.model';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<any>(null);

  constructor(private socialAuthService: SocialAuthService) {}

  signInWithSocialMedia(method: string) {
    if (method.toLowerCase() === 'google') {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    } else if (method.toLowerCase() === 'facebook') {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
    return this.socialAuthService.authState;
  }

  signOut(): Observable<any> {
    this.socialAuthService.signOut();
    return this.socialAuthService.authState;
  }

  registerUser(user: IUserCredential) {
    console.log(user);
  }
}
