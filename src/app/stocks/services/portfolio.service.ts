import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ErrorResponse } from 'src/app/shared/types';
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
          this.store.setLoading(true);
        }),
        catchError((errorResponse: ErrorResponse) => {
          this.store.setError(errorResponse.error);

          return EMPTY;
        })
      )
      .subscribe();
  }

  public summary(id = 'summary', asOf: Date = new Date()): void {
    this.store.setLoading(true);

    this.http
      .get<StockPortfolioSummary>(
        `/stocks/portfolios/${id}/?as_of=${format(asOf, 'yyyy-MM-dd')}`
      )
      .pipe(
        tap((summary) => void this.store.update({ summary })),
        catchError((errorResponse: ErrorResponse) => {
          /**
           * In this case there is no transaction data for the given portfolio up until the as of config
           * this way we should display the no data screen.
           */
          if (errorResponse.status === 404) {
            this.store.update({ summary: null });
          } else {
            this.store.setError(errorResponse.error);
          }

          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }
}
