import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import {
  BarChartComponent,
  BasicStockDataTable,
  PieChartComponent,
  StockDividendTableComponent,
  StockPnlTableComponent,
  StockRiskTable,
  TreemapChartComponent,
} from './components';
import { StocksRoutingModule } from './stocks-routing.module';
import { PortfolioSummaryViewComponent } from './views';

const VIEWS = [PortfolioSummaryViewComponent];
const COMPONENTS = [
  BasicStockDataTable,
  TreemapChartComponent,
  StockRiskTable,
  PieChartComponent,
  StockDividendTableComponent,
  BarChartComponent,
  StockPnlTableComponent,
];

@NgModule({
  imports: [CommonModule, MaterialModule, StocksRoutingModule, SharedModule],
  declarations: [...VIEWS, ...COMPONENTS],
})
export class StocksModule {}
