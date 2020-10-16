import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { IUserCredential } from '../models/userCredential.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, exhaustMap, take, tap } from 'rxjs/operators';
import { ILoginCredential } from '../models/loginCredential.model';
import { User } from '../models/user.model';
import { env } from '../../environments/env';

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
          this.user.next(userData);
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
    return this.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http
          .get(`${env.SERVER_URL}/auth`, {
            headers: new HttpHeaders({ 'x-auth-token': user.token }),
          })
          .pipe(catchError(this.handleError));
      })
    );
  }

  signOut(): Observable<any> {
    this.socialAuthService.signOut();
    return this.socialAuthService.authState;
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
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage =
      error.error.message || error.error.messages || error.message;
    return throwError(errorMessage);
  }
}
