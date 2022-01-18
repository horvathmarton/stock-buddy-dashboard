import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { authPersistStorage } from './app/auth/state';
import { CoreModule } from './app/core/core.module';
import { corePersistStorage } from './app/core/state';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const providers = [
  { provide: 'persistStorage', useValue: corePersistStorage, multi: true },
  { provide: 'persistStorage', useValue: authPersistStorage, multi: true },
];

platformBrowserDynamic(providers)
  .bootstrapModule(CoreModule)
  .catch((err) => console.error(err));
