import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { KpiComponent } from './components';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardViewComponent } from './views';

const VIEWS = [DashboardViewComponent];
const COMPONENTS = [KpiComponent];

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, SharedModule, MaterialModule],
  declarations: [...VIEWS, ...COMPONENTS],
})
export class DashboardModule {}
