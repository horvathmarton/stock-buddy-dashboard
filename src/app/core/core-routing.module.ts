import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards';
import { NotFoundViewComponent } from './views';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/portfolio',
  },
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'portfolio',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../stocks/stocks.module').then((m) => m.StocksModule),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'watchlist',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../watchlist/watchlist.module').then((m) => m.WatchlistModule),
  },
  {
    path: 'cash',
    canActivate: [AuthGuard],
    loadChildren: () => import('../cash/cash.module').then((m) => m.CashModule),
  },
  {
    path: '**',
    component: NotFoundViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
