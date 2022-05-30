import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchlistViewComponent } from './views';

const routes: Routes = [
  {
    path: '',
    component: WatchlistViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WatchlistRoutingModule {}
