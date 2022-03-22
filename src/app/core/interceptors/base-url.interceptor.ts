import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private baseUrl: string | null = environment.baseUrl;

  constructor() {
    if (this.baseUrl?.endsWith('/')) {
      throw new Error('The base URL should not contain a trailing /.');
    }
  }

  public intercept<T = unknown>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    /*
     * We want to allow the user to call other APIs so if the URL doesn't
     * start with a slash we just pass it through.
     */
    if (!this.baseUrl || !request.url.startsWith('/')) {
      return next.handle(request);
    }

    const clonedRequest = request.clone({
      url: `${this.baseUrl}${request.url}`,
    });

    return next.handle(clonedRequest);
  }
}
