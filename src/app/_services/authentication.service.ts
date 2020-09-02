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
    private userService: UsersService
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
        this.login(email, password);
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

  // Sign in with email/password
  login(email, password) {
    let user: User;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.userService.getUser(result.user.uid).pipe(take(1)).subscribe(singleDoc => {
          user = singleDoc;
          //check if User is admin
          if (user.roles.admin == true) {
            this.router.navigate(['/admin']);
          }
          else if (this.returnUrl != '' && this.returnUrl != '/quizzes') {
            let topic: Topic;
            this.topicsService.getTopic(this.returnUrl.split('/').pop()).pipe(take(1)).subscribe(singleDoc => {
              topic = singleDoc;
              topic.id = this.returnUrl.split('/').pop();
              user.topics.push(topic);
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
    if (isUser && this.returnUrl != '' && this.returnUrl != '/quizzes') {
      console.log("Redirect acitve")
      data = {
        uid: user.uid,
        email: user.email,
        roles: {
          user: isUser,
          admin: isAdmin
        },
        topics: user.topics
      }
    }
    else if (isUser) {
      console.log("No Redirect")
      data = {
        uid: user.uid,
        email: user.email,
        roles: {
          user: isUser,
          admin: isAdmin
        },
        topics: []
      }
    }
    else {
      data = {
        uid: user.uid,
        email: user.email,
        roles: {
          user: isUser,
          admin: isAdmin
        }
      }
    }
    console.log('SET DATA', data)
    return userRef.set(data, { merge: true })
  }

  async confirmSignIn(url) {
    try {
      if (this.afAuth.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('SignInEmail');
        console.log("Signed In with email: ", email)
        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        // Signin user and remove the email localStorage
        const result = await this.afAuth.auth.signInWithEmailLink(email, url,);
        const topicId = localStorage.getItem("TopicId");
        this.setUserData(result.user, false, true);
        window.localStorage.removeItem('SignInEmail');
        const redirect = localStorage.getItem("Redirect");
        this.router.navigateByUrl("/" + redirect);
        localStorage.removeItem("Redirect");
      }
    } catch (err) {
      console.log("Error ", err.code)
    }
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