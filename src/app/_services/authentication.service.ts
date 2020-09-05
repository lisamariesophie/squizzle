import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { TopicsDatabaseService } from './topics-database.service';
import { Topic } from '../_models/topic.model';
import { UsersService } from './users.service';
import { TopicUsersService } from './topicUsers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<User>;
  loggedIn: boolean = false;
  redirectUrl: string;
  userData: User;
  returnUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private topicsService: TopicsDatabaseService,
    private userService: UsersService,
    private topicUserService: TopicUsersService
  ) {
    // get authState
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

  // Sign up with email/password
  register(email, password) {
    let user: any;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // this.sendVerificationMail();
        user = result.user;
        user.topics = [];
        this.setUserData(user, false, true);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
  }

  login(email, password) {
    let user: User;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.userService.getUser(result.user.uid).pipe(take(1)).subscribe(res => {
          user = res;
          //check if User is admin
          if (user.roles.admin == true) {
            this.router.navigate(['/admin']);
          }
          else if (this.returnUrl != '' && this.returnUrl != '/quizzes') {
            this.topicsService.getTopic(this.returnUrl.split('/').pop()).pipe(take(1)).subscribe(res => {
              let topic: any;
              topic = res;
              const topicId = this.returnUrl.split('/').pop();
              this.topicsService.createUserTopic(user.uid, topicId, topic);
              let topicUser;
              this.userService.getUser(user.uid).pipe(take(1)).subscribe(res => {
                topicUser = {
                  topicId: topicId,
                  userId: res.uid
                }
                this.topicUserService.createUserTopic(topicUser)
              });
              this.setUserData(user, false, true)
              this.router.navigateByUrl(this.returnUrl);
            });
          }
          else {
            this.router.navigateByUrl(this.returnUrl);
          }
        })
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign in with email/password
  // login(email, password) {
  //   let user: User;
  //   return this.afAuth.auth.signInWithEmailAndPassword(email, password)
  //     .then((result) => {
  //       this.userService.getUser(result.user.uid).pipe(take(1)).subscribe(singleDoc => {
  //         user = singleDoc;
  //         //check if User is admin
  //         if (user.roles.admin == true) {
  //           this.router.navigate(['/admin']);
  //         }
  //         else if (this.returnUrl != '' && this.returnUrl != '/quizzes') {
  //           this.topicsService.getTopic(this.returnUrl.split('/').pop()).pipe(take(1)).subscribe(singleDoc => {
  //             let topic: any;
  //             topic = singleDoc;
  //             const topicId = this.returnUrl.split('/').pop();
  //             // user.topics.push(topic);
  //             this.topicsService.createUserTopic(user.uid, topicId, topic);
  //             this.setUserData(user, false, true)
  //             this.router.navigateByUrl(this.returnUrl);
  //           });
  //         }
  //         else {
  //           this.router.navigateByUrl(this.returnUrl);
  //         }
  //       })
  //     }).catch((error) => {
  //       window.alert(error.message)
  //     })
  // }

  // Reset Forggot password
  forgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
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

  canRead(user: User): boolean {
    const allowed = ['admin', 'user']
    return this.checkAuthorization(user, allowed)
  }

  isAdmin(user: any): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
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

  async logout() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}