import { Component, inject, OnInit } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ItemCardEditableComponent } from '@shared/components/item-card-editable/item-card-editable.component';
import { ItemWithQuantity } from '@core/models/item.model';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LucideAngularModule, Search } from 'lucide-angular';
import { RemoveItemAlertComponent } from '@features/manage-template/components/remove-item-alert/remove-item-alert.component';
import { SearchItemsModalComponent } from '@features/manage-template/components/search-items-modal/search-items-modal.component';
import { PreferencesService } from '@core/services/preferences.service';

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
export class ManageTemplateComponent implements OnInit {
  protected readonly Search = Search;
  private readonly preferencesService = inject(PreferencesService);

  isRemoveItemAlertSuppressed = false;
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

  ngOnInit() {
    this.preferencesService.get<boolean>('suppressRemoveItemAlert').then((value) => {
      this.isRemoveItemAlertSuppressed = value ?? false;
    });
  }

  removeItem(itemId: number): void {
    this.items = this.items.filter((iq) => iq.item.id !== itemId);
  }

  handleQuantityChange(itemQuantity: ItemWithQuantity, newQuantity: number): void {
    if (newQuantity > 0) {
      itemQuantity.quantity = newQuantity;
      return;
    }

    if (this.isRemoveItemAlertSuppressed) {
      this.removeItem(itemQuantity.item.id);
      return;
    }

    this.selectedItemToRemove = itemQuantity;
    this.isRemoveItemAlertOpen = true;
  }

  onConfirmRemoveItem(isNoAskAgainChecked: boolean): void {
    this.isRemoveItemAlertOpen = false;
    this.isRemoveItemAlertSuppressed = isNoAskAgainChecked;

    if (this.isRemoveItemAlertSuppressed) {
      this.preferencesService.set('suppressRemoveItemAlert', true);
    }

    if (this.selectedItemToRemove != null) {
      this.removeItem(this.selectedItemToRemove.item.id);
      this.selectedItemToRemove = null;
    }
  }

  onCancelRemoveItem(): void {
    this.isRemoveItemAlertOpen = false;

    if (this.selectedItemToRemove) {
      this.selectedItemToRemove.quantity = 1;
    }
  }
}
