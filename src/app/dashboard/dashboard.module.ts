import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import {
  StrategyEditorDialogComponent,
  StrategySelectorDialogComponent,
} from './components';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardViewComponent } from './views';

const VIEWS = [DashboardViewComponent];
const COMPONENTS = [
  StrategyEditorDialogComponent,
  StrategySelectorDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [...VIEWS, ...COMPONENTS],
})
export class DashboardModule {}
