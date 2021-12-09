import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { StocksRoutingModule } from './stocks-routing.module';
import { PortfolioSummaryViewComponent } from './views';

const VIEWS = [PortfolioSummaryViewComponent];

@NgModule({
  imports: [CommonModule, MaterialModule, StocksRoutingModule],
  declarations: [...VIEWS],
})
export class StocksModule {}
