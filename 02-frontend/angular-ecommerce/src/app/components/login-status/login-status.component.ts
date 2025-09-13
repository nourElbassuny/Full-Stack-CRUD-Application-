import {Component, Inject, OnInit} from '@angular/core';
import OktaAuth from '@okta/okta-auth-js';
import {OktaAuthStateService} from '@okta/okta-angular';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login-status',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './login-status.component.html',
  standalone: true,
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  storage:Storage=sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OktaAuth) private oktaAuth: OktaAuth,) {
  }

  ngOnInit() {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }

  private getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
          const theEmail = res.email as string;
          this.storage.setItem("userEmail", JSON.stringify(theEmail));
        }
      );
    }
  }
  logout():void{
    this.oktaAuth.signOut();
  }

}
