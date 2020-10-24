import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CloudModel } from 'src/app/models/cloud.model';
import { CloudService } from 'src/app/services/cloud.service';

@Injectable()
export class CloudResolver implements Resolve<CloudModel> {
  constructor(private cloudService: CloudService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CloudModel> | Promise<CloudModel> | CloudModel {
    return this.cloudService.getCloud();
  }
}
