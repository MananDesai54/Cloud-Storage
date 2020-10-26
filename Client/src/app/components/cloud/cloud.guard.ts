import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class CloudGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.user.pipe(
      take(1),
      map((user: User) => {
        if (!user.email.verified && !(router.url[0]?.path === 'verify')) {
          return this.router.createUrlTree(['cloud/verify']);
        } else {
          if (router.url[0]?.path === 'verify' && user.email.verified) {
            return this.router.createUrlTree(['cloud/setting']);
          }
          return true;
        }
        return true;
      })
    );
  }
}
