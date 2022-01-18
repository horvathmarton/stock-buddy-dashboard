import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';

export interface AuthState {
  authToken: string | null;
}

@StoreConfig({ name: 'auth' })
@Injectable({ providedIn: 'root' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super({ authToken: null });
  }
}

export const authPersistStorage = persistState({
  include: ['auth'],
  key: '@stock-buddy/auth',
});
