import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { env } from '../../environments/env';
import { User } from '../models/user.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ProfileService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  updateProfile(userData, user) {
    console.log('Hello profile');
    return this.http.put(`${env.SERVER_URL}/users`, userData).pipe(
      catchError((error) => this.authService.handleError(error)),
      tap((updatedUser) => {
        this.authService.user.next({ ...user, ...updatedUser });
        this.authService.updateUser(updatedUser);
      })
    );
  }
}
