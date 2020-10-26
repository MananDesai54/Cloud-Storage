import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CloudModel } from 'src/app/models/cloud.model';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from 'src/app/services/cloud.service';

@Injectable()
export class CloudResolver implements Resolve<CloudModel> {
  constructor(
    private cloudService: CloudService,
    private authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CloudModel> | Promise<CloudModel> | CloudModel {
    return this.cloudService
      .getCloud()
      .pipe(catchError((error) => throwError(error)));
  }
}
