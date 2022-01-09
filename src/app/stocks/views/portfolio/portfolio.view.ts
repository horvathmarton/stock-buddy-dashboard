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

  public sizeDistribution: any[] = [];
  public sizeDistributionAtCost: any[] = [];
  public sectorDistribution: any[] = [];

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
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
}
