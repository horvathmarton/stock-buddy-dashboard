import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { ContentHeaderComponent, ErrorMessageComponent } from './components';

const COMPONENTS = [ContentHeaderComponent, ErrorMessageComponent];

@NgModule({
  imports: [MaterialModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
