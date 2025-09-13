import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import '@angular/localize/init';
import {importProvidersFrom} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {OKTA_CONFIG, OktaAuthModule} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import myAppConfig from './app/config/my-app-config';
import {AuthInterceptorService} from './app/services/auth-interceptor.service';

const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes),importProvidersFrom(ReactiveFormsModule, OktaAuthModule), // Include OktaAuthModule
    {
      provide: OKTA_CONFIG,
      useValue: { oktaAuth }  // Provide configuration
    },
    {
      provide: OktaAuth,        // Explicitly provide OktaAuth service
      useValue: oktaAuth
    }
    ],
}).catch(err => alert(err.message));
