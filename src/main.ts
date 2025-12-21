import { AppModule } from './app/app.module';
import { defineCustomElements as jeepSqliteDefineCustomElements } from 'jeep-sqlite/loader';
import { platformBrowser } from '@angular/platform-browser';

jeepSqliteDefineCustomElements(window);

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
