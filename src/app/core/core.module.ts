import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreRoutingModule } from './core-routing.module';
import { AppViewComponent, NotFoundViewComponent } from './views';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticateInterceptor } from './interceptors/authenticate.interceptor';
import { BaseUrlInterceptor } from './interceptors';
import { AuthGuard } from './guards';

const VIEWS = [AppViewComponent, NotFoundViewComponent];
const GUARDS = [AuthGuard];

@NgModule({
  declarations: [...VIEWS],
  imports: [
    BrowserModule,
    CoreRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    ...GUARDS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticateInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppViewComponent],
})
export class CoreModule {}
