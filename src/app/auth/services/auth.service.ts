import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo, pluck, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly LOCAL_STORAGE_AUTH_TOKEN_KEY = '@stock-buddy/auth-token';

  private authToken: string | null = localStorage.getItem(
    this.LOCAL_STORAGE_AUTH_TOKEN_KEY
  );

  public get authenticated(): boolean {
    return !!this.authToken;
  }

  public get token(): string | null {
    return this.authToken;
  }

  constructor(private readonly http: HttpClient) {}

  public login(username: string, password: string): Observable<void> {
    return this.http
      .post<{ token: string }>('/auth/', {
        username,
        password,
      })
      .pipe(
        pluck('token'),
        tap((token) => this.updateToken(token)),
        mapTo(undefined)
      );
  }

  public logout(): void {
    this.clearToken();
  }

  private updateToken(token: string): void {
    localStorage.setItem(this.LOCAL_STORAGE_AUTH_TOKEN_KEY, token);
    this.authToken = token;
  }

  private clearToken(): void {
    localStorage.removeItem(this.LOCAL_STORAGE_AUTH_TOKEN_KEY);
    this.authToken = null;
  }
}
