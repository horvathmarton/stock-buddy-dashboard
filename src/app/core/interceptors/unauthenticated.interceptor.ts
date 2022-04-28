import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services';
import { ErrorResponse } from '../../shared/types';

@Injectable()
export class UnauthenticatedInterceptor implements HttpInterceptor {
  private readonly ignoredRoutes = ['/auth/login'];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  public intercept<T = unknown>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((errorResponse: ErrorResponse) => {
        if (
          errorResponse.status === 401 &&
          !this.ignoredRoutes.includes(this.router.url)
        ) {
          this.authService.logout();

          void this.router.navigate(['/auth/login']);
        }

        throw errorResponse;
      })
    );
  }
}
