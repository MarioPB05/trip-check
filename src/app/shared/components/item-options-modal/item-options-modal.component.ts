import { Component, Input } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { LocationItem } from '@core/models/location.model';
import { MenuItem } from '@core/interfaces/modal.interface';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-item-options-modal',
  templateUrl: './item-options-modal.component.html',
  styleUrls: ['./item-options-modal.component.scss'],
  imports: [IonContent, IonHeader, NgOptimizedImage, LucideAngularModule, NgClass],
})
export class ItemOptionsModalComponent {
  @Input() locationItem!: LocationItem;
  @Input() menuItems: MenuItem[] = [];
}
