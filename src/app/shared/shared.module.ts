import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import {
  BarChartComponent,
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
];

@NgModule({
  imports: [MaterialModule, CommonModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
