import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreRoutingModule } from './core-routing.module';
import { AppViewComponent, NotFoundViewComponent } from './views';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

const VIEWS = [AppViewComponent, NotFoundViewComponent];

@NgModule({
  declarations: [...VIEWS],
  imports: [
    BrowserModule,
    CoreRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppViewComponent],
})
export class CoreModule {}
