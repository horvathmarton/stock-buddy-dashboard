import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { notNull } from 'src/app/shared/utils';
import { StockPosition } from '../../interfaces/stock-positions.interface';
import { PortfolioService } from '../../services';
import { StockPortfolioQuery } from '../../state';

type PageControlValues = { portfolio: string; asOf: Date };

@Component({
  templateUrl: './portfolio.view.html',
  styleUrls: ['./portfolio.view.scss'],
})
export class PortfolioSummaryViewComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<boolean>();

  public readonly isLoading = this.query.selectLoading();
  public readonly error = this.query.selectError();
  public readonly controls = this.builder.group({
    /* eslint-disable @typescript-eslint/unbound-method */
    portfolio: ['summary', Validators.required],
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
    private readonly stockPortfolioService: PortfolioService,
    private readonly builder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly query: StockPortfolioQuery
  ) {}

  public ngOnInit(): void {
    this.stockPortfolioService.list();

    this.handleControlChanges();
    this.handleSummaryChanges();
    this.initializeControls();
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
        filter(notNull),
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
    this.controls.valueChanges
      .pipe(
        tap(({ portfolio, asOf }: PageControlValues) =>
          this.stockPortfolioService.summary(portfolio, asOf)
        ),
        tap(({ portfolio, asOf }: PageControlValues) => {
          void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { portfolio, asOf: format(asOf, 'yyyy-MM-dd') },
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
        filter((portfolios) => !!portfolios),
        switchMap(
          () => this.route.queryParams as Observable<PageControlValues>
        ),
        tap((queryParams) => {
          if (queryParams.asOf) {
            queryParams = { ...queryParams, asOf: new Date(queryParams.asOf) };
          }

          const portfolio = Number.parseInt(queryParams.portfolio);
          queryParams = {
            ...queryParams,
            portfolio: !Number.isNaN(portfolio)
              ? portfolio.toString()
              : 'summary',
          };

          this.controls.patchValue(queryParams);
        }),
        take(1)
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
}
