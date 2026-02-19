import { AppModule } from '@app/app.module';
import { defineCustomElements as jeepSqliteDefineCustomElements } from 'jeep-sqlite/loader';
import { platformBrowser } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  alertCircleOutline,
  informationCircleOutline,
} from 'ionicons/icons';

addIcons({
  'checkmark-circle-outline': checkmarkCircleOutline,
  'close-circle-outline': closeCircleOutline,
  'alert-circle-outline': alertCircleOutline,
  'information-circle-outline': informationCircleOutline,
});
jeepSqliteDefineCustomElements(window);

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
