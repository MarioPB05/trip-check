import { Component } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ItemCardEditableComponent } from '@shared/components/item-card-editable/item-card-editable.component';
import { Item, ItemWithQuantity } from '@core/models/item.model';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LucideAngularModule, Search } from 'lucide-angular';
import { RemoveItemAlertComponent } from '@features/manage-template/components/remove-item-alert/remove-item-alert.component';
import { SearchItemsModalComponent } from '@features/manage-template/components/search-items-modal/search-items-modal.component';

@Component({
  selector: 'app-create-template',
  templateUrl: './manage-template.component.html',
  styleUrls: ['./manage-template.component.scss'],
  imports: [
    IonContent,
    ItemCardEditableComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    TripButtonComponent,
    LucideAngularModule,
    RemoveItemAlertComponent,
    SearchItemsModalComponent,
  ],
})
export class ManageTemplateComponent {
  protected readonly Search = Search;

  isRemoveItemAlertOpen = false;
  selectedItemToRemove: ItemWithQuantity | null = null;

  items: ItemWithQuantity[] = [
    {
      item: {
        id: 2,
        name: 'Item 1',
        emojiUrl: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1fa72.svg',
        deleted: false,
      },
      quantity: 2,
    },
  ];

  handleQuantityChange(itemQuantity: ItemWithQuantity, newQuantity: number): void {
    if (newQuantity > 0) {
      itemQuantity.quantity = newQuantity;
      return;
    }

    // Si llega a 0, no lo dejamos en 0 todavía
    this.selectedItemToRemove = itemQuantity;
    this.isRemoveItemAlertOpen = true;
  }

  onConfirmRemoveItem(): void {
    console.log('Item removed');
    this.isRemoveItemAlertOpen = false;

    if (this.selectedItemToRemove != null) {
      this.items = this.items.filter((iq) => iq.item.id !== this.selectedItemToRemove?.item.id);
      this.selectedItemToRemove = null;
    }
  }

  onCancelRemoveItem(): void {
    console.log('Item removal cancelled');
    this.isRemoveItemAlertOpen = false;

    if (this.selectedItemToRemove) {
      this.selectedItemToRemove.quantity = 1;
    }
  }
}
