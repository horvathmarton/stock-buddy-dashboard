import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { StockPortfolio, StockPortfolioSummary } from '../interfaces';

export interface StockPortfolioState
  extends EntityState<StockPortfolio, string> {
  summary: StockPortfolioSummary | null;
}

@StoreConfig({ name: 'stock-portfolios' })
@Injectable({ providedIn: 'root' })
export class StockPortfolioStore extends EntityStore<StockPortfolioState> {
  constructor() {
    super();
  }
}
