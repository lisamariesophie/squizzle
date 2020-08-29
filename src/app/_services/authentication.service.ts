import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  user: Observable<User>;
  loggedIn: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    // get authState
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.loggedIn = true;
          // console.log(user);
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          this.loggedIn = false;
          return of(null);
        }
      })
    )
  }

  // Sign up with email/password
  signUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.updateUserData(result.user);
        this.router.navigate(['/events']);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign in with email/password
  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.updateUserData(result.user);
        this.router.navigate(['/admin']);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }
    return userRef.set(data, { merge: true })
  }

  async logout() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}