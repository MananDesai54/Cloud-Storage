import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CloudModel } from '../models/cloud.model';
import { env } from '../../environments/env';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class CloudService {
  isNavOpen = false;
  navToggle = new Subject();

  cloud = new BehaviorSubject<CloudModel>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  toggleNavOpen() {
    this.isNavOpen = !this.isNavOpen;
    this.navToggle.next(this.isNavOpen);
  }

  getCloud() {
    return this.http
      .get<CloudModel>(`${env.SERVER_URL}/cloud`)
      .pipe(catchError((error) => this.authService.handleError(error)));
  }
}
