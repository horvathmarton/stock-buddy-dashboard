import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import {
  BasicStockDataTable,
  StockDividendTableComponent,
  StockPnlTableComponent,
  StockRiskTable,
} from './components';
import { StocksRoutingModule } from './stocks-routing.module';
import { PortfolioSummaryViewComponent } from './views';

const VIEWS = [PortfolioSummaryViewComponent];
const COMPONENTS = [
  BasicStockDataTable,
  StockRiskTable,
  StockDividendTableComponent,
  StockPnlTableComponent,
];

@NgModule({
  imports: [CommonModule, MaterialModule, StocksRoutingModule, SharedModule],
  declarations: [...VIEWS, ...COMPONENTS],
})
export class StocksModule {}
