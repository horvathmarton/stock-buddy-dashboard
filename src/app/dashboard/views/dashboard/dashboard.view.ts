import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { DIALOG_BASE_CONFIG } from 'src/app/shared/data';
import { isDefined } from 'src/app/shared/utils';
import { StrategyEditorDialogComponent } from '../../components';
import { Strategy } from '../../interfaces';
import { PortfolioIndicatorsService, StrategiesService } from '../../services';
import { PortfolioIndicatorsQuery, StrategiesQuery } from '../../state';

@Component({
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.view.scss'],
})
export class DashboardViewComponent implements OnInit {
  public readonly isLoading = combineLatest([
    this.strategiesQuery.selectLoading(),
    this.portfolioIndicatorsQuery.selectLoading(),
  ]).pipe(map(([strategies, indicators]) => strategies || indicators));
  public readonly strategyError = this.strategiesQuery.selectError();
  public readonly indicatorsError = this.portfolioIndicatorsQuery.selectError();

  public currentStrategy!: Record<string, number>;
  public targetStrategy!: Record<string, number>;
  public indicators = this.portfolioIndicatorsQuery.indicators.pipe(
    filter((indicators) => !!indicators)
  );

  constructor(
    private readonly dashboardService: StrategiesService,
    private readonly portfolioIndicatorsService: PortfolioIndicatorsService,
    private readonly strategiesQuery: StrategiesQuery,
    private readonly portfolioIndicatorsQuery: PortfolioIndicatorsQuery,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.dashboardService.fetchMyStrategy();
    this.portfolioIndicatorsService.fetch();

    this.strategiesQuery.me
      .pipe(
        filter(isDefined),
        tap((strategy) => {
          this.currentStrategy = this.transformStrategyItems(strategy.current);
          this.targetStrategy = this.transformStrategyItems(strategy.target);
        }),
        take(1)
      )
      .subscribe();
  }

  public createStrategy(event: Event): void {
    event.stopImmediatePropagation();

    this.dialog
      .open(StrategyEditorDialogComponent, DIALOG_BASE_CONFIG)
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap(console.log)
      )
      .subscribe();
  }

  private transformStrategyItems(strategy: Strategy): Record<string, number> {
    return strategy.items.reduce(
      (obj, { name, size }) => ({ ...obj, [name]: size }),
      {}
    );
  }
}
