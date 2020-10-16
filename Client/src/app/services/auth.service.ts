import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { IUserCredential } from '../models/userCredential.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ILoginCredential } from '../models/loginCredential.model';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  socialUserSubject = new Subject<any>();

  constructor(
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUserSubject.next(user);
    });
  }

  signInWithSocialMedia(method: string, signIn?: boolean) {
    if (method.toLowerCase() === 'google') {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    } else if (method.toLowerCase() === 'facebook') {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }

  checkEmailExist(email) {
    return this.http
      .get(`http://localhost:5000/api/auth/${email}`, {
        observe: 'body',
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(error.error.message || error.message)
        )
      );
  }

  registerUser(user: IUserCredential) {
    console.log(user);
    return this.http
      .post<User>('http://localhost:5000/api/users', user, {
        // observe: 'response',
        // observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  loginUser(user: ILoginCredential) {
    return this.http.post<User>('http://localhost:5000/api/auth', user).pipe(
      catchError(this.handleError),
      tap((userData) => {
        console.log(
          +userData.tokenExpiration - +new Date().getTime().toFixed(0)
        );
      })
    );
  }

  signOut(): Observable<any> {
    this.socialAuthService.signOut();
    return this.socialAuthService.authState;
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage =
      error.error.message || error.error.messages || error.message;
    return throwError(errorMessage);
  }
}
