import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { authPersistStorage } from './app/auth/state';
import { CoreModule } from './app/core/core.module';
import { corePersistStorage } from './app/core/state';
import { environment } from './environments/environment';
import { filterExceptions } from './helpers';

if (['staging', 'production'].includes(environment.env))
  Sentry.init({
    dsn: 'https://47d589340bba44fc98c97f9531cff5e8@o1120245.ingest.sentry.io/6471446',
    integrations: [
      new BrowserTracing({
        tracingOrigins: ['http://localhost:4200', 'https://stock-buddy.com'],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 0.0,
    beforeSend: filterExceptions,
  });

if (environment.env === 'production') {
  enableProdMode();
}

const providers = [
  { provide: 'persistStorage', useValue: corePersistStorage, multi: true },
  { provide: 'persistStorage', useValue: authPersistStorage, multi: true },
];

platformBrowserDynamic(providers)
  .bootstrapModule(CoreModule)
  .catch((err) => console.error(err));
