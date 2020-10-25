import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe, Subject } from 'rxjs';
import { CloudModel } from '../models/cloud.model';
import { env } from '../../environments/env';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Folder } from '../models/folder.model';

@Injectable()
export class CloudService {
  isNavOpen = false;
  navToggle = new Subject();

  cloud = new BehaviorSubject<CloudModel>(null);
  currentLocation = new BehaviorSubject<string>(null);

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

  createFolder(name: any, location: string) {
    const body = {
      name,
      location,
    };
    return this.http
      .post<CloudModel>(`${env.SERVER_URL}/cloud/folder`, body)
      .pipe(
        catchError((error) => this.authService.handleError(error)),
        tap((cloud) => {
          this.cloud.next(cloud);
        })
      );
  }

  getFolder(id: string) {
    return this.http
      .get<Folder>(`${env.SERVER_URL}/cloud/folders/${id}`)
      .pipe(catchError((error) => this.authService.handleError(error)));
  }
}
