import { Component, OnInit } from '@angular/core';
import { IonContent, IonModal, IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-items-modal',
  templateUrl: './search-items-modal.component.html',
  styleUrls: ['./search-items-modal.component.scss'],
  imports: [IonContent, IonModal, IonSearchbar],
})
export class SearchItemsModalComponent {}
