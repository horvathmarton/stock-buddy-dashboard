import { Component, OnInit } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { StocksService } from '../../services';

@Component({
  templateUrl: './portfolio.view.html',
  styleUrls: ['./portfolio.view.scss'],
})
export class PortfolioSummaryViewComponent implements OnInit {
  public isLoading = false;
  public basicData: any;

  public sizeDistribution!: Record<string, number>;
  public sizeDistributionAtCost!: Record<string, number>;
  public sectorDistribution!: Record<string, number>;
  public dividendIncome!: Record<string, number>;
  public dividendYield!: Record<string, number>;
  public yieldOnCost!: Record<string, number>;
  public pnl!: Record<string, number>;

  constructor(private readonly stocksService: StocksService) {}

  public ngOnInit(): void {
    this.isLoading = true;

    this.stocksService
      .summary()
      .pipe(
        tap((response: any) => {
          this.basicData = Object.values(response.positions);
          this.sizeDistribution = response.size_distribution;
          this.sizeDistributionAtCost = response.size_at_cost_distribution;
          this.sectorDistribution = response.sector_distribution;

          this.dividendIncome = this.extractProperty(
            response.positions,
            'dividend_income'
          );
          this.dividendYield = this.extractProperty(
            response.positions,
            'dividend_yield'
          );
          this.yieldOnCost = this.extractProperty(
            response.positions,
            'dividend_yield_on_cost'
          );
          this.pnl = this.extractProperty(response.positions, 'pnl_percentage');
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  private extractProperty(
    data: Record<string, Record<string, number>>,
    property: string
  ): Record<string, number> {
    return Object.entries(data).reduce((obj, curr) => {
      const [key, value] = curr;
      obj[key as any] = (value as any)[property];

      return obj;
    }, {} as Record<string, number>);
  }
}
