import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, pluck, tap } from 'rxjs/operators';
import { defaultCatchError } from 'src/app/shared/operators';
import { ApiPaginationResponse } from 'src/app/shared/types';
import { Stock } from '../interfaces';
import { StockPortfolioQuery, StockStore } from '../state';
import { PortfolioService } from './portfolio.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: StockStore,
    private readonly portfolioService: PortfolioService,
    private readonly portfolioQuery: StockPortfolioQuery
  ) {}

  public list(): void {
    this.store.setLoading(true);

    this.http
      .get<ApiPaginationResponse<Stock>>(`/stocks/`)
      .pipe(
        pluck('results'),
        tap((stocks) => {
          this.store.set(stocks);
        }),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }
}
