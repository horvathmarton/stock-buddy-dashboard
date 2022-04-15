import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { StockPortfolio } from '../interfaces';
import { StockPortfolioState, StockPortfolioStore } from './portfolios.store';

@Injectable({ providedIn: 'root' })
export class StockPortfolioQuery extends QueryEntity<StockPortfolioState> {
  public summary = this.select('summary');
  public portfolios = this.selectAll();
  public selectedPortfolio = this.selectActive() as Observable<
    StockPortfolio | undefined
  >;

  constructor(protected store: StockPortfolioStore) {
    super(store);
  }
}
