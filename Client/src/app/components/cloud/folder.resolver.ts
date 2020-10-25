import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Folder } from 'src/app/models/folder.model';
import { CloudService } from 'src/app/services/cloud.service';

@Injectable()
export class FolderResolver implements Resolve<Folder> {
  constructor(private cloudService: CloudService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Folder | Observable<Folder> | Promise<Folder> {
    return this.cloudService.getFolder(route.params.id);
  }
}
