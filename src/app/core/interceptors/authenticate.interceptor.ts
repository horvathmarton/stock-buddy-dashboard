import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthQuery } from 'src/app/auth/state';

@Injectable()
export class AuthenticateInterceptor implements HttpInterceptor {
  constructor(private readonly query: AuthQuery) {}

  public intercept<T = unknown>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    return this.query.authToken.pipe(
      take(1),
      switchMap((token) => {
        // If the user already set the Authorization header, we won't overwrite it.
        if (!token || request.headers.get('Authorization')) {
          return next.handle(request);
        }

        const authedRequest = request.clone({
          headers: request.headers.set('Authorization', `Token ${token}`),
        });

        return next.handle(authedRequest);
      })
    );
  }
}
