import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../services/global.service';
import { StatsServerService } from '../services/stats-server.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  currentUser = null;

  constructor(
    private gs: GlobalService,
    private as: AuthService,
    private ss: StatsServerService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.gs.isBrowser) {
      this.as.currentUser.subscribe(user => this.currentUser = user);
      const userToken = localStorage.getItem(environment.tokenName);
      const header: any = {};
      if (this.currentUser && userToken && request.url.startsWith(environment.apiUrl)) {
        this.gs.log('[INTERCEPT_REQUEST]', userToken.slice(0, 5) + '.....' + userToken.slice(userToken.length - 5, userToken.length));
        header.Authorization = `Bearer ${userToken}`;
      }
      if (this.ss.mySocket) {
        header.Socket = this.ss.mySocket.id;
      }
      request = request.clone({
        setHeaders: header
      });
    }
    return next.handle(request);
  }

}
