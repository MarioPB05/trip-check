import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-template-tab',
  templateUrl: './template-tab.component.html',
  styleUrls: ['./template-tab.component.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
})
export class TemplateTabComponent {
  constructor() {}
}
