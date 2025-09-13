import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, from, lastValueFrom} from 'rxjs';
import {OKTA_AUTH} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService /*implements HttpInterceptor*/ {

  // constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
  // }
  //
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   console.log('AuthInterceptor triggered for:', req.url);
  //   return from(this.handleAccess(req, next));
  // }
  //
  // private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
  //   const securedEndPoints = ['http://localhost:8084/api/orders'];
  //
  //   if (securedEndPoints.some(url => req.urlWithParams.includes(url))) {
  //     const accessToken =  this.oktaAuth.getAccessToken(); // <-- await here
  //     console.log('Access Token:', accessToken);
  //
  //     if (accessToken) {
  //       req = req.clone({
  //         setHeaders: {
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       });
  //     }
  //   }
  //
  //   return await lastValueFrom(next.handle(req));
  // }

}
