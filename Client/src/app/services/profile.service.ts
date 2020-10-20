import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { env } from '../../environments/env';
import { User } from '../models/user.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ProfileService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  updateProfile(userData: any, user: User) {
    return this.http.put(`${env.SERVER_URL}/users`, userData).pipe(
      catchError((error) => this.authService.handleError(error)),
      tap((updatedUser) => {
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
        this.authService.user.next(updatedUserData);
        this.authService.updateUser(updatedUser);
      })
    );
  }

  sendEmailVerificationMail(email) {
    return this.http
      .post(`${env.SERVER_URL}/auth/send-verification-mail`, { email })
      .pipe(catchError((error) => this.authService.handleError(error)));
  }
}
