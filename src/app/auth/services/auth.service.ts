import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo, switchMap, take, tap } from 'rxjs/operators';
import { AuthQuery, AuthStore } from '../state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: AuthStore,
    private readonly query: AuthQuery
  ) {}

  public login(username: string, password: string): Observable<void> {
    return this.http
      .post<{ access: string; refresh: string }>('/auth/sign-in', {
        username,
        password,
      })
      .pipe(
        tap(
          ({ access, refresh }) =>
            void this.store.update({ authToken: access, refreshToken: refresh })
        ),
        mapTo(undefined)
      );
  }

  public logout(): void {
    this.store.reset();
  }

  public changePassword(password: string): Observable<void> {
    return this.http.post<void>('/auth/change-password', { password });
  }

  public refreshTokens(): Observable<void> {
    return this.query.refreshToken.pipe(
      take(1),
      switchMap((token) => this.http.post('/auth/refresh-token', { token })),
      mapTo(undefined)
    );
  }
}
