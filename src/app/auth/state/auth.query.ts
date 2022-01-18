import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AuthStore } from '.';
import { AuthState } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
  public isAuthenticated = this.select((state) => !!state.authToken);
  public authToken = this.select('authToken');

  constructor(protected store: AuthStore) {
    super(store);
  }
}
