import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import {
  BasicStockDataTable,
  PieChartComponent,
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
];

@NgModule({
  imports: [CommonModule, MaterialModule, StocksRoutingModule],
  declarations: [...VIEWS, ...COMPONENTS],
})
export class StocksModule {}
