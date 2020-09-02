import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-passwordless-auth',
  templateUrl: './passwordless-auth.component.html',
  styleUrls: ['./passwordless-auth.component.scss']
})
export class PasswordlessAuthComponent implements OnInit {

  user: Observable<any>;
  email: string;
  emailSent = false;

  errorMessage: string;
  

  constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
   
    this.user = this.afAuth.authState;
    const url = this.router.url;
    this.confirmSignIn(url);
  }

  async sendEmailLink() {
    const actionCodeSettings = {
      // Your redirect URL
      url: 'http://localhost:4200/register',
      handleCodeInApp: true
    };
    try {
      await this.afAuth.auth.sendSignInLinkToEmail(
        this.email,
        actionCodeSettings
      );
      window.localStorage.setItem('SignInEmail', this.email);
      this.emailSent = true;
    } catch (error) {
      this.errorMessage = error.message;
    }
  }

  confirmSignIn(url) {
    this.authService.confirmSignIn(url);
  }
}
