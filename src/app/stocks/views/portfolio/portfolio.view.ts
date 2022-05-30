import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  BasicEntityDialogComponent,
  DisposableComponent,
} from 'src/app/shared/components';
import { isDefined } from 'src/app/shared/utils';
import { StockTransactionDialogComponent } from '../../components';
import {
  StockPortfolio,
  StockPosition,
  StockTransaction,
} from '../../interfaces';
import { PortfolioService, StockService } from '../../services';
import { StockPortfolioQuery } from '../../state';

type PageControlValues = { portfolio: StockPortfolio; as_of: Date };

@Component({
  templateUrl: './portfolio.view.html',
  styleUrls: ['./portfolio.view.scss'],
})
export class PortfolioSummaryViewComponent
  extends DisposableComponent
  implements OnInit
{
  private readonly DIALOG_BASE_CONFIG = {
    minHeight: '300px',
    minWidth: '400px',
    width: '60vw',
    maxWidth: '700px',
  };

  public readonly SUMMARY_VALUE = {
    name: 'Summary',
    id: 'summary',
  } as unknown as StockPortfolio;

  public readonly isLoading = this.query.selectLoading();
  public readonly error = this.query.selectError();
  public readonly createTransaction = new Subject<string | null>();
  public readonly controls = this.builder.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    portfolio: [this.SUMMARY_VALUE, Validators.required],
    asOf: [new Date(), Validators.required],
    /* eslint-enable */
  });

  public basicData!: StockPosition[];
  public sizeDistribution!: Record<string, number>;
  public sizeDistributionAtCost!: Record<string, number>;
  public sectorDistribution!: Record<string, number>;
  public dividendIncome!: Record<string, number>;
  public dividendYield!: Record<string, number>;
  public yieldOnCost!: Record<string, number>;
  public pnl!: Record<string, number>;
  public annualizedPnl!: Record<string, number>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly builder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly stockPortfolioService: PortfolioService,
    private readonly stockService: StockService,
    public readonly query: StockPortfolioQuery
  ) {
    super();
  }

  public ngOnInit(): void {
    this.stockPortfolioService.list();

    this.handleControlChanges();
    this.handleSummaryChanges();
    this.initializeControls();
    this.handleTransactionCreation();
  }

  public createPortfolio(): void {
    this.dialog
      .open(BasicEntityDialogComponent, {
        ...this.DIALOG_BASE_CONFIG,
        data: { title: 'Create portfolio' },
      })
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap((portfolio: StockPortfolio) =>
          this.stockPortfolioService.create(portfolio)
        )
      )
      .subscribe();
  }

  public editPortfolio(event: Event, id: number): void {
    event.stopImmediatePropagation();

    this.query.portfolios
      .pipe(
        switchMap((portfolios) =>
          this.dialog
            .open(BasicEntityDialogComponent, {
              ...this.DIALOG_BASE_CONFIG,
              data: {
                entity: portfolios.find((p) => p.id === id),
                title: 'Edit portfolio',
              },
            })
            .afterClosed()
        ),
        filter((result) => isDefined(result)),
        tap((portfolio: StockPortfolio) =>
          this.stockPortfolioService.update(portfolio)
        ),
        take(1)
      )
      .subscribe();
  }

  private extractProperty(
    data: Record<string, StockPosition>,
    property: 'dividend_yield' | 'dividend_yield_on_cost' | 'pnl_percentage'
  ): Record<string, number> {
    return Object.entries(data).reduce<Record<string, number>>((obj, curr) => {
      const [key, value] = curr;
      obj[key] = value[property];

      return obj;
    }, {});
  }

  private handleSummaryChanges(): void {
    this.query.summary
      .pipe(
        filter(isDefined),
        tap((summary) => {
          this.basicData = Object.values(summary.positions);
          this.sizeDistribution = summary.size_distribution;
          this.sizeDistributionAtCost = summary.size_at_cost_distribution;
          this.sectorDistribution = summary.sector_distribution;
          this.dividendIncome = summary.dividend_distribution;

          this.dividendYield = this.extractProperty(
            summary.positions,
            'dividend_yield'
          );
          this.yieldOnCost = this.extractProperty(
            summary.positions,
            'dividend_yield_on_cost'
          );
          this.pnl = this.extractProperty(summary.positions, 'pnl_percentage');
          this.annualizedPnl = summary.annualized_pnls;
        }),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  private handleControlChanges(): void {
    this.controls.controls.portfolio.valueChanges
      .pipe(
        tap((portfolio: StockPortfolio) =>
          this.stockPortfolioService.select(
            portfolio.id !== this.SUMMARY_VALUE.id ? portfolio : undefined
          )
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();

    this.controls.valueChanges
      .pipe(
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        map(({ portfolio, asOf }) => ({
          portfolio,
          as_of: asOf,
        })),
        /* eslint-enable */
        tap(({ portfolio, as_of }: PageControlValues) =>
          this.stockPortfolioService.summary(portfolio.id, as_of)
        ),
        tap(({ portfolio, as_of }: PageControlValues) => {
          void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              portfolio: portfolio.id,
              as_of: format(as_of, 'yyyy-MM-dd'),
            },
            queryParamsHandling: 'merge',
          });
        }),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  private initializeControls(): void {
    this.query.portfolios
      .pipe(
        filter((portfolios) => !!portfolios && portfolios.length !== 0),
        withLatestFrom(
          this.route.queryParams as Observable<{
            portfolio: string;
            as_of: Date;
          }>
        ),
        tap(([portfolios, queryParams]) => {
          if (queryParams.as_of) {
            queryParams = {
              ...queryParams,
              as_of: new Date(queryParams.as_of),
            };
          }

          const portfolioId = Number.parseInt(queryParams.portfolio);
          const portfolio = portfolios.find((p) => p.id === portfolioId);

          this.controls.patchValue({
            ...queryParams,
            portfolio: portfolio ?? this.SUMMARY_VALUE,
          });
          this.stockPortfolioService.select(portfolio);
        }),
        take(1)
      )
      .subscribe();
  }

  private handleTransactionCreation(): void {
    this.createTransaction
      .pipe(
        switchMap((ticker) => {
          return this.dialog
            .open(StockTransactionDialogComponent, {
              ...this.DIALOG_BASE_CONFIG,
              data: { ticker },
            })
            .afterClosed();
        }),
        filter((result) => !!result),
        tap((transaction: StockTransaction) =>
          this.stockService.createTransaction(transaction)
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }
}
