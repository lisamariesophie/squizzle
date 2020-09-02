import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
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
