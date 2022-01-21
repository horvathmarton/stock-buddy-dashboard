import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import {
  BarChartComponent,
  ContentHeaderComponent,
  ErrorMessageComponent,
  PieChartComponent,
  TreemapChartComponent,
} from './components';

const COMPONENTS = [
  ContentHeaderComponent,
  ErrorMessageComponent,
  BarChartComponent,
  PieChartComponent,
  TreemapChartComponent,
];

@NgModule({
  imports: [MaterialModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
