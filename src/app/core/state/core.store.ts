import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';

export interface CoreState {
  isDark: boolean;
}

@StoreConfig({ name: 'core' })
@Injectable({ providedIn: 'root' })
export class CoreStore extends Store<CoreState> {
  constructor() {
    super({ isDark: false });
  }
}

export const corePersistStorage = persistState({
  include: ['core'],
  key: '@stock-buddy/core',
});
