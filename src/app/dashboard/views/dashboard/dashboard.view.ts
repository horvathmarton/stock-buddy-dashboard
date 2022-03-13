import { Component, OnInit } from '@angular/core';
import { filter, take, tap } from 'rxjs/operators';
import { Strategy } from '../../interfaces';
import { DashboardService } from '../../services';
import { DashboardQuery } from '../../state';

@Component({
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.view.scss'],
})
export class DashboardViewComponent implements OnInit {
  public readonly isLoading = this.query.selectLoading();
  public readonly error = this.query.selectError();

  public currentStrategy!: Record<string, number>;
  public targetStrategy!: Record<string, number>;
  public indicators = this.query.indicators.pipe(
    filter((indicators) => !!indicators)
  );

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly query: DashboardQuery
  ) {}

  public ngOnInit(): void {
    this.dashboardService.fetch();

    this.query.me
      .pipe(
        filter((strategy) => !!strategy),
        tap((strategy) => {
          this.currentStrategy = this.transformStrategyItems(strategy!.current);
          this.targetStrategy = this.transformStrategyItems(strategy!.target);
        }),
        take(1)
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
