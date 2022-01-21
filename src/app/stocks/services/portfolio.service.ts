import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { StockPortfolio, StockPortfolioSummary } from '../interfaces';
import { StockPortfolioStore } from '../state';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: StockPortfolioStore
  ) {}

  public list(): void {
    this.store.setLoading(true);

    this.http
      .get<StockPortfolio[]>(`/stocks/portfolios/`)
      .pipe(
        tap((portfolios) => {
          this.store.set(portfolios);
          this.summary();
        }),
        catchError((errorResponse) => {
          this.store.setError(errorResponse.error);

          return EMPTY;
        })
      )
      .subscribe();
  }

  public summary(id: string = 'summary', asOf: Date = new Date()): void {
    this.store.setLoading(true);

    this.http
      .get<StockPortfolioSummary>(
        `/stocks/portfolios/${id}/?asOf=${format(asOf, 'yyyy-MM-dd')}`
      )
      .pipe(
        tap((summary) => this.store.update({ summary })),
        catchError((errorResponse) => {
          this.store.setError(errorResponse.error);

          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }
}
