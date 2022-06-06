import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TransactionsState, TransactionsStore } from './trasactions.store';

@Injectable({ providedIn: 'root' })
export class TransactionsQuery extends Query<TransactionsState> {
  public cash = this.select('cash');
  public forex = this.select('forex');
  public stock = this.select('stock');

  constructor(protected store: TransactionsStore) {
    super(store);
  }
}
