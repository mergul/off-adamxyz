import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { first, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthsGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    if (!this.userService.dbUser) {
      return this.authService.isLoggedIn().pipe(
        first(),
        switchMap((logged) => {
          if (logged) {
            if (
              state.url === '/login' ||
              state.url === '/register' ||
              state.url === '/loginin'
            ) {
              return this.router.navigate(['/user']);
            } /*if (state.url === '/upload')*/ else {
              return this.authService.getUser().pipe(
                mergeMap((us) => {
                  if (us && this.userService.user) {
                    this.userService._loggedUser = this.userService.user;
                    this.userService._loggedUser.id = this.userService.user.id =
                      this.userService.createId(us.uid);
                    this.userService.setReactiveListeners();
                    this.userService._me = this.userService.getDbUser(
                      '/api/rest/start/user/' +
                        this.userService.user.id +
                        '/' +
                        this.userService.getRandom()
                    );
                    return forkJoin([
                      this.userService._me,
                      this.authService.token,
                    ]);
                  }
                  return forkJoin([of(this.userService.dbUser), of('')]);
                }),
                switchMap((tokens) => {
                  if (tokens[0]) {
                    this.userService.setDbUser(tokens[0]);
                    if (this.userService.user)
                      this.userService.user.token = tokens[1];
                    this.authService.changeEmitter.next(of(true));
                    return this.router.navigate(['/upload']);
                  }
                  return this.router.navigate(['/home']);
                })
              );
            }
          } else {
            if (state.url === '/upload') {
              this.userService.redirectUrl = '/upload';
              return this.router.navigate(['/loginin']);
            }
            return of(true);
          }
        })
      );
    } else return of(true);
  }
}
