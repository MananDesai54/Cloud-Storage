import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe, Subject, throwError } from 'rxjs';
import { CloudModel } from '../models/cloud.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Folder } from '../models/folder.model';

export const STATUS = {
  CREATED: 'created',
  EDITED: 'edited',
  DELETED: 'deleted',
};

@Injectable()
export class CloudService {
  isNavOpen = false;
  navToggle = new Subject();

  cloud = new BehaviorSubject<CloudModel>(null);
  currentLocation = new BehaviorSubject<string>(null);
  folderAction = new Subject<{ folder: any; status: string; parent?: any }>();
  fileAction = new Subject<{ file: any; status: string; parent?: any }>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  toggleNavOpen() {
    this.isNavOpen = !this.isNavOpen;
    this.navToggle.next(this.isNavOpen);
  }

  getCloud() {
    return this.http
      .get<CloudModel>(`${environment.SERVER_URL}/cloud`)
      .pipe(catchError((error) => this.authService.handleError(error)));
  }

  createFolder(name: any, location: string) {
    const body = {
      name,
      location,
    };
    return this.http.post(`${environment.SERVER_URL}/cloud/folder`, body).pipe(
      catchError((error) => this.authService.handleError(error)),
      tap((res: any) => {
        this.cloud.next(res.cloud);
        this.folderAction.next({
          folder: res.newFolder,
          status: STATUS.CREATED,
          parent: res.currentFolder,
        });
      })
    );
  }

  getFolder(id: string) {
    return this.http
      .get<Folder>(`${environment.SERVER_URL}/cloud/folders/${id}`)
      .pipe(catchError((error) => this.authService.handleError(error)));
  }

  editFolder(data: any) {
    return this.http.put(`${environment.SERVER_URL}/cloud/folders`, data).pipe(
      catchError((error) => this.authService.handleError(error)),
      tap((res) => {
        this.folderAction.next({ folder: res, status: STATUS.EDITED });
      })
    );
  }

  deleteFolder(id: string) {
    return this.http
      .delete(`${environment.SERVER_URL}/cloud/folders/${id}`)
      .pipe(
        catchError((error) => this.authService.handleError(error)),
        tap((res: any) => {
          this.cloud.next(res.cloud);
          this.folderAction.next({
            folder: res.folder,
            status: STATUS.DELETED,
            parent: res.parent,
          });
        })
      );
  }

  uploadFile(file: any, folderId: string) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .post(`${environment.SERVER_URL}/cloud/file/${folderId}`, fd)
      .pipe(
        catchError((error) => this.authService.handleError(error)),
        tap((res: any) => {
          this.cloud.next(res.cloud);
          this.fileAction.next({
            file: res.file,
            status: STATUS.CREATED,
            parent: res.parent,
          });
        })
      );
  }

  editFile(data: any) {
    return this.http.put(`${environment.SERVER_URL}/cloud/files`, data).pipe(
      catchError((error) => this.authService.handleError(error)),
      tap((res) => {
        this.fileAction.next({ file: res, status: STATUS.EDITED });
      })
    );
  }

  deleteFile(id: string) {
    return this.http.delete(`${environment.SERVER_URL}/cloud/files/${id}`).pipe(
      catchError((error) => this.authService.handleError(error)),
      tap((res: any) => {
        this.cloud.next(res.cloud);
        this.fileAction.next({
          file: res.file,
          status: STATUS.DELETED,
          parent: res.parent,
        });
      })
    );
  }

  downloadFile(id: string) {
    return this.http
      .get(`${environment.SERVER_URL}/cloud/download/${id}`, {
        responseType: 'blob',
      })
      .pipe(catchError((error) => this.authService.handleError(error)));
  }
}
