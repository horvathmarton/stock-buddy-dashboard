import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import {
  BarChartComponent,
  BasicEntityDialogComponent,
  ConfirmationDialogComponent,
  ContentHeaderComponent,
  ErrorMessageComponent,
  PieChartComponent,
  ToggleableComponent,
  TreemapChartComponent,
} from './components';

const COMPONENTS = [
  ContentHeaderComponent,
  ErrorMessageComponent,
  BarChartComponent,
  PieChartComponent,
  TreemapChartComponent,
  ToggleableComponent,
  BasicEntityDialogComponent,
  ConfirmationDialogComponent,
];

@NgModule({
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
