import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AppViewComponent, NotFoundViewComponent } from './views';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from 'src/environments/environment';

const VIEWS = [AppViewComponent, NotFoundViewComponent];
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
  ],
  bootstrap: [AppViewComponent],
})
export class CoreModule {}
