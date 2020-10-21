import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
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
      map(
        (user: User) => {
          const isAuth = !!user;
          if (isAuth) {
            if (
              router.url.length === 0 ||
              router.url[0].path === 'login' ||
              router.url[0].path === 'signup'
            ) {
              return this.router.createUrlTree(['/cloud']);
            }
            return true;
          } else {
            if (
              router.url.length === 0 ||
              router.url[0].path === 'login' ||
              router.url[0].path === 'signup'
            ) {
              return true;
            }
            return this.router.createUrlTree(['/']);
          }
        }
        // tap((isAuth) => {
        //   console.log(isAuth);
        //   if (!isAuth) {
        //     this.router.navigate(['/']);
        //   } else {
        //     this.router.navigate(['/cloud']);
        //   }
        // })
      )
    );
  }
}
