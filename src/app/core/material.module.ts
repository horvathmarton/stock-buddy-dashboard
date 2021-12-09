import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const MODULES = [
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class MaterialModule {}
