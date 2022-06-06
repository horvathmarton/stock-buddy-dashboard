import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { StockTransaction } from 'src/app/stocks/interfaces';
import { CashTransaction, ForexTransaction } from '../interfaces';

export interface TransactionsState {
  cash: CashTransaction[] | null;
  forex: ForexTransaction[] | null;
  stock: StockTransaction[] | null;
}

@StoreConfig({ name: 'trasactions' })
@Injectable({ providedIn: 'root' })
export class TransactionsStore extends Store<TransactionsState> {
  constructor() {
    super({ cash: null, forex: null, stock: null });
  }
}
