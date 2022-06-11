import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isDefined } from '@datorama/akita';
import {
  combineLatest,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { DisposableComponent } from 'src/app/shared/components';
import { some } from 'src/app/shared/operators';
import { ErrorService } from 'src/app/shared/services';
import { StockTransaction } from 'src/app/stocks/interfaces';
import { PortfolioService } from 'src/app/stocks/services';
import {
  CashTransactionDialogComponent,
  ForexTransactionDialogComponent,
  ForexTransactionDialogResult,
  StockTransactionDialogComponent,
} from '../../components';
import { CashTransaction, ForexTransaction } from '../../interfaces';
import { TransactionsService } from '../../services';
import { CashService } from '../../services/cash.service';
import { CashQuery, TransactionsQuery } from '../../state';

@Component({
  templateUrl: './cash.view.html',
  styleUrls: ['./cash.view.scss'],
})
export class CashViewComponent extends DisposableComponent implements OnInit {
  public cashTransactions = this.transactionsQuery.cash.pipe(filter(isDefined));
  public forexTransactions = this.transactionsQuery.forex.pipe(
    filter(isDefined)
  );
  public stockTransactions = this.transactionsQuery.stock.pipe(
    filter(isDefined)
  );

  public readonly createCashTransaction = new Subject<null>();
  public readonly createForexTransaction = new Subject<null>();
  public readonly createStockTransaction = new Subject<null>();

  public readonly isLoading = combineLatest([
    this.cashQuery.selectLoading(),
    this.transactionsQuery.selectLoading(),
  ]).pipe(tap(console.log), some());

  private readonly DIALOG_BASE_CONFIG = {
    minHeight: '300px',
    minWidth: '400px',
    width: '60vw',
    maxWidth: '700px',
  };

  constructor(
    public readonly cashQuery: CashQuery,
    public readonly transactionsQuery: TransactionsQuery,
    private readonly dialog: MatDialog,
    private readonly cashService: CashService,
    private readonly errorService: ErrorService,
    private readonly portfolioService: PortfolioService,
    private readonly transactionsService: TransactionsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.handleTransactionCreation();

    this.transactionsService.list();
    this.cashService.fetch();
    this.portfolioService.list();

    this.errorService
      .showErrors(
        this.cashQuery.selectError(),
        this.transactionsQuery.selectError()
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe();
  }

  private handleTransactionCreation(): void {
    this.createCashTransaction
      .pipe(
        switchMap(() =>
          this.dialog
            .open(CashTransactionDialogComponent, {
              ...this.DIALOG_BASE_CONFIG,
            })
            .afterClosed()
        ),
        filter(isDefined),
        tap((result: CashTransaction) =>
          this.transactionsService.createCashTransaction(result)
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();

    this.createForexTransaction
      .pipe(
        switchMap(() =>
          this.dialog
            .open(ForexTransactionDialogComponent, {
              ...this.DIALOG_BASE_CONFIG,
            })
            .afterClosed()
            .pipe(
              map((result: ForexTransactionDialogResult) => ({
                ...result,
                source_currency: result.sourceCurrency,
                target_currency: result.targetCurrency,
              }))
            )
        ),
        filter(isDefined),
        tap((result: ForexTransaction) =>
          this.transactionsService.createForexTransaction(result)
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();

    this.createStockTransaction
      .pipe(
        switchMap(() =>
          this.dialog
            .open(StockTransactionDialogComponent, {
              ...this.DIALOG_BASE_CONFIG,
            })
            .afterClosed()
        ),
        filter(isDefined),
        tap((result: StockTransaction) =>
          this.transactionsService.createStockTransaction(result)
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }
}
