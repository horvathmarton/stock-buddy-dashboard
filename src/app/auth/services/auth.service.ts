import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo, pluck, tap } from 'rxjs/operators';
import { AuthStore } from '../state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: AuthStore
  ) {}

  public login(username: string, password: string): Observable<void> {
    return this.http
      .post<{ token: string }>('/auth/', {
        username,
        password,
      })
      .pipe(
        pluck('token'),
        tap((token) => void this.store.update({ authToken: token })),
        mapTo(undefined)
      );
  }

  public logout(): void {
    this.store.update({ authToken: null });
  }
}
