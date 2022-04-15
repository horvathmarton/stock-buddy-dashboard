import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { ErrorResponse } from 'src/app/shared/types';
import { Stock, StockTransaction } from '../interfaces';
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
      .get<Stock[]>(`/stocks/`)
      .pipe(
        tap((stocks) => {
          this.store.set(stocks);
        }),
        catchError((errorResponse: ErrorResponse) => {
          this.store.setError(errorResponse.error);

          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public createTransaction(transaction: StockTransaction): void {
    this.store.setLoading(true);

    this.http
      .post<StockTransaction>(`/transactions/stocks`, transaction)
      .pipe(
        switchMap(() => this.portfolioQuery.selectedPortfolio),
        tap((portfolio) => this.portfolioService.summary(portfolio?.id)),
        catchError((errorResponse: ErrorResponse) => {
          this.store.setError(errorResponse.error);

          return EMPTY;
        })
      )
      .subscribe();
  }
}
