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
    path: '**',
    component: NotFoundViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
