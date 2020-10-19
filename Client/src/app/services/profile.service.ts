import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { env } from '../../environments/env';
import { User } from '../models/user.model';

@Injectable()
export class ProfileService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  updateProfile() {
    // return this.http.put
  }
}
