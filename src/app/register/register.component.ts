import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }
  
  public register(email: string, password: string, confirm: string) {
    if(password == confirm){
      this.authService.register(email, password).then(user => {
        console.log(user);
      });
    }
  }
}
