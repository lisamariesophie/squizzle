import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { UsersService } from './users.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<User> = null;
  loggedIn: boolean = false;
  redirectUrl: string;
  userData: User;
  returnUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private userService: UsersService,
    private toast: ToastService
  ) {
    // get currentUser
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.loggedIn = true;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          this.loggedIn = false;
          return of(null);
        }
      })
    )
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/quizzes';
    });

  }

  isAdmin(user: any): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  // Sign up with email/password
  register(email, password) {
    let user: any;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        user = result.user;
        this.setUserData(user, false, true)
        this.login(email, password);
      }).catch((error) => {
        this.toast.showError(error.message);
      })
  }

  login(email, password) {
    let user: User;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.userService.getUser(result.user.uid).pipe(take(1)).subscribe(res => {
          user = res;
          //check if User is admin
          if (user.roles != null && user.roles.admin == true) {
            this.router.navigate(['/admin']);
          }
          else if (this.returnUrl != '' && this.returnUrl != '/quizzes') {  //
            this.setUserData(user, false, true)
            this.router.navigateByUrl(this.returnUrl);
          }
          else {
            this.router.navigateByUrl(this.returnUrl);
          }
        })
      }).catch((error) => {
        this.toast.showError(error.message);
      })
  }

  async logout() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  // Set user in firestore
  private setUserData(user: any, isAdmin: boolean, isUser: boolean) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    let data;
    data = {
      uid: user.uid,
      email: user.email,
      roles: {
        user: isUser,
        admin: isAdmin
      }
    }
    return userRef.set(data, { merge: true })
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }

    return false;
  }
}