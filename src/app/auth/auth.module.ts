import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material.module';
import { LoginViewComponent } from './views';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

const VIEWS = [LoginViewComponent];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [...VIEWS],
})
export class AuthModule {}
