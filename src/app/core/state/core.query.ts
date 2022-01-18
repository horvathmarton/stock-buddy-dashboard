import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CoreState, CoreStore } from './core.store';

@Injectable({ providedIn: 'root' })
export class CoreQuery extends Query<CoreState> {
  public isDark = this.select('isDark');

  constructor(protected store: CoreStore) {
    super(store);
  }
}
