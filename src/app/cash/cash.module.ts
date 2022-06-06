import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { CashRoutingModule } from './cash-routing.module';
import {
  CashTransactionDialogComponent,
  ForexTransactionDialogComponent,
  StockTransactionDialogComponent,
  TransactionTableComponent,
} from './components';
import { CashViewComponent } from './views';

const VIEWS = [CashViewComponent];
const COMPONENTS = [
  TransactionTableComponent,
  StockTransactionDialogComponent,
  CashTransactionDialogComponent,
  ForexTransactionDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    CashRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [...VIEWS, ...COMPONENTS],
})
export class CashModule {}
