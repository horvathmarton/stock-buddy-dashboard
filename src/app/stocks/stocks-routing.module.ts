import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioSummaryViewComponent } from './views';

const routes: Routes = [
  {
    path: '',
    component: PortfolioSummaryViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StocksRoutingModule {}
