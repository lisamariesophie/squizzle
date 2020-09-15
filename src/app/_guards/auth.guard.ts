import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { take, map, tap } from 'rxjs/operators';
import { ConnectionService } from '../_services/connection.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthenticationService,
    public router: Router,
    public route: ActivatedRoute  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          window.alert('Access denied. Please Sign In.')
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        }
      })
    )
  }

}