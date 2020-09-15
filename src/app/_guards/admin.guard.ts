import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { take, map, tap } from 'rxjs/operators';
import { ConnectionService } from '../_services/connection.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private connectionService: ConnectionService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.connectionService.isOnline){
        return this.authService.user.pipe(
          take(1),
          map(user => (user && user.roles.admin ? true : false)), // CHANGE!!!!
          tap(isAdmin => {
            if (!isAdmin) {
              this.router.navigate(['/login']);
            }
          })
        );
      }
      else if(!this.connectionService.isOnline) {
        return true;
      }
  }
}
