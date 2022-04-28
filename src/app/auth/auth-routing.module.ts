import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent, ProfileViewComponent } from './views';

const routes: Routes = [
  {
    path: 'login',
    component: LoginViewComponent,
  },
  {
    path: 'profile',
    component: ProfileViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
