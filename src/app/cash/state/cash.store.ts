import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CashBalance } from '../interfaces';

export interface CashState extends EntityState<CashBalance, number> {
  total: CashBalance | null;
}

@StoreConfig({ name: 'cash' })
@Injectable({ providedIn: 'root' })
export class CashStore extends EntityStore<CashState> {
  constructor() {
    super({ total: null });
  }
}
