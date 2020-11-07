import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ProfileService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  updateProfile(userData: any, user: User) {
    return this.http.put(`${environment.SERVER_URL}/users`, userData).pipe(
      catchError((error) => this.authService.handleError(error)),
      tap((updatedUser) => {
        const updatedUserData = this.setUser(user, updatedUser);
        console.log(updatedUserData);
        this.authService.user.next(updatedUserData);
        this.authService.updateUser(updatedUser);
      })
    );
  }

  findMe(user: User) {
    this.authService.user.next(user);
    this.authService.updateUser(user);
  }

  sendEmailVerificationMail(email: string) {
    return this.http
      .post(`${environment.SERVER_URL}/auth/send-verification-mail`, { email })
      .pipe(catchError((error) => this.authService.handleError(error)));
  }

  deleteAccount(password: string) {
    const options = {
      body: {
        password,
      },
    };
    console.log()
    return this.http
      .request('delete', `${environment.SERVER_URL}/profile`, {
        body: { password },
      })
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.authService.handleError(error);
        }),
        tap(() => {
          this.authService.logout();
        })
      );
  }

  verifyEmail(userData: any, user: User) {
    const updatedUserData = this.setUser(user, userData);
    this.authService.user.next(updatedUserData);
    this.authService.updateUser(updatedUserData);
  }

  uploadProfilePhoto(file: any, user: User) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .post(`${environment.SERVER_URL}/profile/avatar/upload`, fd, {
        // observe: 'events',
      })
      .pipe(
        catchError((error) => this.authService.handleError(error)),
        tap((profile: any) => {
          // if (event.type === HttpEventType.UploadProgress) {
          //   console.log(event.type);
          // }
          const updatedUserData = this.setUser(user, {
            profileUrl: profile.profileUrl,
          });
          this.authService.user.next(updatedUserData);
          this.authService.updateUser(updatedUserData);
        })
      );
  }

  deleteAvatar(profileUrl, user) {
    return this.http
      .request('delete', `${environment.SERVER_URL}/profile/avatar`, {
        body: { profileUrl },
      })
      .pipe(
        catchError((error) => this.authService.handleError(error)),
        tap((url: any) => {
          const updatedUserData = this.setUser(user, {
            profileUrl: url.profileUrl,
          });
          this.authService.user.next(updatedUserData);
          this.authService.updateUser(updatedUserData);
        })
      );
  }

  private setUser(user: User, userData: any) {
    const updatedUserData = new User(
      user.method,
      user.username,
      user.email,
      user.id,
      user.profileUrl,
      user.token,
      user.tokenExpiration
    );
    for (const field in userData) {
      if (userData.hasOwnProperty(field)) {
        updatedUserData[field] = userData[field];
      }
    }
    return updatedUserData;
  }
}
