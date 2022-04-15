import { Injectable } from '@angular/core';
import { EntityState, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from '../interfaces';
import { StockStore } from './stocks.store';

@Injectable({ providedIn: 'root' })
export class StockQuery extends QueryEntity<EntityState<Stock, string>> {
  public stocks = this.selectAll();

  constructor(protected store: StockStore) {
    super(store);
  }

  public filteredStocks(filter: string): Observable<Stock[]> {
    const normalizedFilter = filter.toLocaleLowerCase();

    return this.stocks.pipe(
      map((stocks) =>
        stocks.filter(
          (stock) =>
            stock.ticker.toLocaleLowerCase().includes(normalizedFilter) ||
            stock.name.toLocaleLowerCase().includes(normalizedFilter)
        )
      )
    );
  }

  public tickerExists(ticker: string): Observable<boolean> {
    return this.stocks.pipe(
      map((stocks) => stocks.some((stock) => stock.ticker === ticker))
    );
  }
}
