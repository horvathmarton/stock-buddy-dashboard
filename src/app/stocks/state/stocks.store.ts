import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Stock } from '../interfaces';

@StoreConfig({ name: 'stocks', idKey: 'ticker' })
@Injectable({ providedIn: 'root' })
export class StockStore extends EntityStore<EntityState<Stock, string>> {
  constructor() {
    super();
  }
}
