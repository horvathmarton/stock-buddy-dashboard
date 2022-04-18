import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { isDefined } from 'src/app/shared/utils';
import {
  StrategyEditorDialogComponent,
  StrategySelectorDialogComponent,
} from '../../components';
import { Strategy } from '../../interfaces';
import { PortfolioIndicatorsService, StrategiesService } from '../../services';
import { PortfolioIndicatorsQuery, StrategiesQuery } from '../../state';

@Component({
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.view.scss'],
})
export class DashboardViewComponent implements OnInit {
  private readonly DIALOG_BASE_CONFIG = {
    minWidth: '400px',
    width: '70vw',
    maxWidth: '800px',
  };

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
        })
      )
      .subscribe();
  }

  public createStrategy(event: Event): void {
    event.stopImmediatePropagation();

    this.dialog
      .open(StrategyEditorDialogComponent, this.DIALOG_BASE_CONFIG)
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap((strategy: Strategy) => this.dashboardService.create(strategy))
      )
      .subscribe();
  }

  public selectStrategy(event: Event): void {
    event.stopImmediatePropagation();

    this.dialog
      .open(StrategySelectorDialogComponent, this.DIALOG_BASE_CONFIG)
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap((strategy: Strategy) => this.dashboardService.select(strategy))
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
