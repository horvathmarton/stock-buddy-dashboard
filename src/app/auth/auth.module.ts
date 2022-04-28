import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material.module';
import { LoginViewComponent, ProfileViewComponent } from './views';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

const VIEWS = [LoginViewComponent, ProfileViewComponent];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [...VIEWS],
})
export class AuthModule {}
