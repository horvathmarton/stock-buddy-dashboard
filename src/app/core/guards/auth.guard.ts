import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/auth/state';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly query: AuthQuery
  ) {}

  public canActivate(): Observable<boolean> {
    return this.query.isAuthenticated.pipe(
      tap((authenticated) => {
        if (!authenticated) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}
