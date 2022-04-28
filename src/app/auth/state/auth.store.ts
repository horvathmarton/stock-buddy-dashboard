import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';

export interface AuthState {
  authToken: string | null;
  refreshToken: string | null;
}

@StoreConfig({ name: 'auth', resettable: true })
@Injectable({ providedIn: 'root' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super({ authToken: null, refreshToken: null });
  }
}

export const authPersistStorage = persistState({
  include: ['auth'],
  key: '@stock-buddy/auth',
});
