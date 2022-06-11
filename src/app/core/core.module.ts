import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import * as Sentry from '@sentry/angular';
import { environment } from 'src/environments/environment';
import {
  DarkModeToggleComponent,
  SidenavComponent,
  ToolbarComponent,
} from './components';
import { CoreRoutingModule } from './core-routing.module';
import { AuthGuard } from './guards';
import { BaseUrlInterceptor, UnauthenticatedInterceptor } from './interceptors';
import { AuthenticateInterceptor } from './interceptors/authenticate.interceptor';
import { MaterialModule } from './material.module';
import {
  AppViewComponent,
  NoConnectionViewComponent,
  NotFoundViewComponent,
} from './views';

const VIEWS = [
  AppViewComponent,
  NotFoundViewComponent,
  NoConnectionViewComponent,
];
const COMPONENTS = [
  DarkModeToggleComponent,
  ToolbarComponent,
  SidenavComponent,
];
const GUARDS = [AuthGuard];

@NgModule({
  declarations: [...VIEWS, ...COMPONENTS],
  imports: [
    BrowserModule,
    CoreRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthenticatedInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      /* eslint-disable @typescript-eslint/no-empty-function */
      useFactory: () => () => {},
      /* eslint-enable */
      deps: [Sentry.TraceService],
      multi: true,
    },
  ],
  bootstrap: [AppViewComponent],
})
export class CoreModule {}
