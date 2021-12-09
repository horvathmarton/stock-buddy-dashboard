import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services';

@Injectable()
export class AuthenticateInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // If the user already set the Authorization header, we won't overwrite it.
    if (!this.auth.token || request.headers.get('Authorization')) {
      return next.handle(request);
    }

    const authedRequest = request.clone({
      headers: request.headers.set('Authorization', `Token ${this.auth.token}`),
    });

    return next.handle(authedRequest);
  }
}
