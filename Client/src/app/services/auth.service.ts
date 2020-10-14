import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IUserCredential } from '../models/userCredential.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<any>(null);
  socialUserSubject = new Subject<any>();

  constructor(
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUserSubject.next(user);
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
    return this.http.post('http://localhost:5000/api/users', user, {
      // observe: 'response',
      observe: 'body',
    });
  }
}
