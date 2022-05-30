import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import {
  BasicStockDataTable,
  StockDividendTableComponent,
  StockPnlTableComponent,
  StockRiskTable,
  StockTransactionDialogComponent,
} from './components';
import { StocksRoutingModule } from './stocks-routing.module';
import { PortfolioSummaryViewComponent } from './views';

const VIEWS = [PortfolioSummaryViewComponent];
const COMPONENTS = [
  BasicStockDataTable,
  StockRiskTable,
  StockDividendTableComponent,
  StockPnlTableComponent,
  StockTransactionDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    StocksRoutingModule,
    SharedModule,
  ],
  declarations: [...VIEWS, ...COMPONENTS],
})
export class StocksModule {}
