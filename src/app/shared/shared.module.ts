import { NgModule } from '@angular/core';
import { ContentHeaderComponent } from './components';

const COMPONENTS = [ContentHeaderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
