import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, pluck, switchMap, tap } from 'rxjs';
import { defaultCatchError } from 'src/app/shared/operators';
import { ApiPaginationResponse } from 'src/app/shared/types';
import { StockTransaction } from 'src/app/stocks/interfaces';
import { PortfolioService } from 'src/app/stocks/services';
import { StockPortfolioQuery } from 'src/app/stocks/state';
import { CashTransaction, ForexTransaction } from '../interfaces';
import { TransactionsStore } from '../state';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: TransactionsStore,
    private readonly portfolioService: PortfolioService,
    private readonly portfolioQuery: StockPortfolioQuery
  ) {}

  public list(): void {
    this.listCashTransactions();
    this.listForexTransactions();
    this.listStockTransactions();
  }

  public listCashTransactions(): void {
    this.store.setLoading(true);

    this.http
      .get<ApiPaginationResponse<CashTransaction>>(`/transactions/cash?limit=8`)
      .pipe(
        pluck('results'),
        tap((transactions) => void this.store.update({ cash: transactions })),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public listForexTransactions(): void {
    this.store.setLoading(true);

    this.http
      .get<ApiPaginationResponse<ForexTransaction>>(
        `/transactions/forex?limit=8`
      )
      .pipe(
        pluck('results'),
        tap((transactions) => void this.store.update({ forex: transactions })),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public listStockTransactions(): void {
    this.store.setLoading(true);

    this.http
      .get<ApiPaginationResponse<StockTransaction>>(
        `/transactions/stocks?limit=8`
      )
      .pipe(
        pluck('results'),
        tap((transactions) => void this.store.update({ stock: transactions })),
        defaultCatchError(this.store),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe();
  }

  public createCashTransaction(transaction: CashTransaction): void {
    this.store.setLoading(true);

    this.http
      .post<CashTransaction>(`/transactions/cash`, transaction)
      .pipe(
        switchMap(() => this.portfolioQuery.selectedPortfolio),
        defaultCatchError(this.store),
        tap(() => this.listCashTransactions())
      )
      .subscribe();
  }

  public createForexTransaction(transaction: ForexTransaction): void {
    this.store.setLoading(true);

    this.http
      .post<StockTransaction>(`/transactions/forex`, transaction)
      .pipe(
        switchMap(() => this.portfolioQuery.selectedPortfolio),
        tap((portfolio) => this.portfolioService.summary(portfolio?.id)),
        defaultCatchError(this.store),
        tap(() => this.listForexTransactions())
      )
      .subscribe();
  }

  public createStockTransaction(transaction: StockTransaction): void {
    this.store.setLoading(true);

    this.http
      .post<StockTransaction>(`/transactions/stocks`, transaction)
      .pipe(
        switchMap(() => this.portfolioQuery.selectedPortfolio),
        tap((portfolio) => this.portfolioService.summary(portfolio?.id)),
        defaultCatchError(this.store),
        tap(() => this.listStockTransactions())
      )
      .subscribe();
  }
}
