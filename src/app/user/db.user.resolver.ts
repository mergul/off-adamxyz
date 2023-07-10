import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import firebase from 'firebase/app';
import User = firebase.User;

@Injectable({ providedIn: 'root' })
export class DbUserResolver implements Resolve<User | null> {
  constructor(private authService: AuthService, private router: Router) {}
  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<User | null> {
    return this.authService.getUser().pipe(
      first(),
      map((logged) => {
        return logged;
      })
    );
  }
}
