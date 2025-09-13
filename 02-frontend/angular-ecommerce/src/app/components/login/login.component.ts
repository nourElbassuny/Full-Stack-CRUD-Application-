import {Component, Inject, OnInit} from '@angular/core';
import myAppConfig  from '../../config/my-app-config';
import {Router} from '@angular/router';
import OktaAuth from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  oktaSignIn:any;
  constructor(@Inject(OktaAuth) private oktaAuth:OktaAuth) {
    this.oktaSignIn=new OktaSignIn({
      logo:'assets/images/logo.png',
      baseUrl:myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId:myAppConfig.oidc.clientId,
      redirectUri:myAppConfig.oidc.redirectUri,
      useClassicEngine: true,
      authParams:{
        pkce:true,
        issuer:myAppConfig.oidc.issuer,
        scpes:myAppConfig.oidc.scopes
      }
    })
  }
  ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn.renderEl({
        el:'#okta-sign-in-widget'},// this name should be same as div tag id in login.component.html
      (response:any)=>{
      if (response.status === 'SUCCESS'){
        this.oktaAuth.signInWithRedirect();
      }
      },
      (error:any)=>{
      alert(error.message);
      throw error;
      }

    )
  }

}
