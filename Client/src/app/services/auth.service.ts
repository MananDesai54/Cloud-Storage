import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserCredential } from '../models/userCredential.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<any>(null);
  socialUser: SocialUser;

  constructor(
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.registerUser({
        email: this.socialUser.email,
        username: this.socialUser.name,
        method: this.socialUser.provider.toLowerCase(),
        id: this.socialUser.id,
        profileUrl: this.socialUser.photoUrl,
      });
    });
  }

  signInWithSocialMedia(method: string) {
    if (method.toLowerCase() === 'google') {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    } else if (method.toLowerCase() === 'facebook') {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }

  signOut(): Observable<any> {
    this.socialAuthService.signOut();
    return this.socialAuthService.authState;
  }

  registerUser(user: IUserCredential) {
    console.log(user);
    return this.http.post('http://localhost:5000/api/users', user);
  }
}
