import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.component.html',
  styleUrls: ['./home-tab.component.scss'],
  imports: [IonTitle, IonToolbar, IonHeader, IonContent],
})
export class HomeTabComponent {
  constructor() {}
}
