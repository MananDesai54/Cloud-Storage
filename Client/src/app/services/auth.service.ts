import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { IUserCredential } from '../models/userCredential.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, exhaustMap, take, tap } from 'rxjs/operators';
import { ILoginCredential } from '../models/loginCredential.model';
import { User } from '../models/user.model';
import { env } from '../../environments/env';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  socialUserSubject = new Subject<any>();
  durationTimer: number;

  constructor(
    private socialAuthService: SocialAuthService,
    private http: HttpClient,
    private router: Router
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
      .get(`${env.SERVER_URL}/auth/${email}`, {
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
      .post<User>(`${env.SERVER_URL}/users`, user, {
        // observe: 'response',
        // observe: 'body',
      })
      .pipe(
        catchError(this.handleError),
        tap((userData) => {
          this.handleAuthentication(userData);
        })
      );
  }

  loginUser(user: ILoginCredential) {
    return this.http.post<User>(`${env.SERVER_URL}/auth`, user).pipe(
      catchError(this.handleError),
      tap((userData) => {
        this.handleAuthentication(userData);
      })
    );
  }

  // ********* run this code before all auth route **********
  authUser() {
    return this.http
      .get<User>(`${env.SERVER_URL}/auth`)
      .pipe(catchError(this.handleError));
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
    if (this.durationTimer) {
      clearTimeout(this.durationTimer);
    }
    this.durationTimer = null;
  }

  autoLogin() {
    const userData: any = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.method,
      userData.username,
      userData.email,
      userData.id,
      userData.profileUrl,
      userData._token,
      userData._tokenExpiration
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        loadedUser.tokenExpiration - new Date().getTime();
      this.autoLogout(expirationDuration);
      console.log(expirationDuration);
    } else {
      // this.logout();
      console.log('Hello');
    }
  }

  autoLogout(expirationDuration: number) {
    setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  updateUser(updatedData) {
    console.log('Hello auth');
    const user = JSON.parse(localStorage.getItem('userData'));
    localStorage.setItem(
      'userData',
      JSON.stringify({ ...user, ...updatedData })
    );
  }

  private handleAuthentication({
    email,
    id,
    method,
    profileUrl,
    token,
    tokenExpiration,
    username,
  }: User) {
    const user = new User(
      method,
      username,
      email,
      id,
      profileUrl,
      token,
      tokenExpiration
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handleError(error: HttpErrorResponse) {
    console.log(error);
    const errorMessage =
      error.error?.message || error.error?.messages || error.message;
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
