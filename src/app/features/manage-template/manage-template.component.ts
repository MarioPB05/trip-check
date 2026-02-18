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
import { Item } from '@core/models/item.model';
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
  protected readonly saveIcon = Save;
  private readonly preferencesService = inject(PreferencesService);

  isRemoveItemAlertSuppressed = false;
  isRemoveItemAlertOpen = false;
  selectedItemToRemove: Item | null = null;

  protected selectedItems: Map<number, Item> = new Map<number, Item>();
  protected quantityByItemId: Map<number, number> = new Map<number, number>();

  ngOnInit() {
    this.preferencesService.get<boolean>('suppressRemoveItemAlert').then((value) => {
      this.isRemoveItemAlertSuppressed = value ?? false;
    });
  }

  removeItem(itemId: number): void {
    this.quantityByItemId.delete(itemId);
    this.selectedItems.delete(itemId);
  }

  addItem(item: Item): void {
    this.selectedItems.set(item.id, item);
    this.quantityByItemId.set(item.id, 1);
  }

  handleQuantityChange(item: Item, newQuantity: number): void {
    if (newQuantity > 0) {
      this.quantityByItemId.set(item.id, newQuantity);
      return;
    }

    if (this.isRemoveItemAlertSuppressed) {
      this.removeItem(item.id);
      return;
    }

    this.selectedItemToRemove = item;
    this.isRemoveItemAlertOpen = true;
  }

  onConfirmRemoveItem(isNoAskAgainChecked: boolean): void {
    this.isRemoveItemAlertOpen = false;
    this.isRemoveItemAlertSuppressed = isNoAskAgainChecked;

    if (this.isRemoveItemAlertSuppressed) {
      this.preferencesService.set('suppressRemoveItemAlert', true).catch((error) => {
        console.error('Error saving preference:', error);
        // TODO: Handle error, show toast, etc.
      });
    }

    if (this.selectedItemToRemove != null) {
      this.removeItem(this.selectedItemToRemove.id);
      this.selectedItemToRemove = null;
    }
  }

  onCancelRemoveItem(): void {
    this.isRemoveItemAlertOpen = false;

    if (this.selectedItemToRemove) {
      this.quantityByItemId.set(this.selectedItemToRemove.id, 1);
      this.selectedItemToRemove = null;
    }
  }

  protected handleItemsSelected(item: Item) {
    this.addItem(item);
  }

  protected handleItemDeselected(item: Item) {
    this.removeItem(item.id);
  }
}
