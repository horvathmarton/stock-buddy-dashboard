import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { StockPortfolioState, StockPortfolioStore } from './portfolios.store';

@Injectable({ providedIn: 'root' })
export class StockPortfolioQuery extends QueryEntity<StockPortfolioState> {
  public summary = this.select('summary');
  public portfolios = this.selectAll();

  constructor(protected store: StockPortfolioStore) {
    super(store);
  }
}
