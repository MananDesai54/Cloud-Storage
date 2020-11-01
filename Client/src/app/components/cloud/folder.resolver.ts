import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Folder } from 'src/app/models/folder.model';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from 'src/app/services/cloud.service';

@Injectable()
export class FolderResolver implements Resolve<Folder> {
  constructor(
    private cloudService: CloudService,
    private authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Folder | Observable<Folder> | Promise<Folder> {
    return this.cloudService.getFolder(route.params.id).pipe(
      catchError((error) => {
        this.authService.logout();
        return throwError(error);
      })
    );
  }
}
