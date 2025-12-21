import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-item-tab',
  templateUrl: './item-tab.component.html',
  styleUrls: ['./item-tab.component.scss'],
  imports: [IonTitle, IonToolbar, IonHeader, IonContent],
})
export class ItemTabComponent {
  constructor() {}
}
