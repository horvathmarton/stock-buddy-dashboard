import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashViewComponent } from './views';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CashViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashRoutingModule {}
