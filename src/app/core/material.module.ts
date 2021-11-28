import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const MODULES = [
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatSlideToggleModule,
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class MaterialModule {}
