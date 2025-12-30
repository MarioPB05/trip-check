import { Component, inject, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ItemService } from '@features/item-tab/services/item.service';
import { Item } from '@core/models/item.model';
import { ItemCardComponent } from '@shared/components/item-card/item-card.component';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';

@Component({
  selector: 'app-item-tab',
  templateUrl: './item-tab.component.html',
  styleUrls: ['./item-tab.component.scss'],
  imports: [IonContent, ItemCardComponent, TripButtonComponent],
})
export class ItemTabComponent implements OnInit {
  private readonly itemService = inject(ItemService);

  protected usedItems: Item[] = [];
  protected notUsedItems: Item[] = [];

  async ngOnInit() {
    this.usedItems = await this.itemService.getAllItemsUsed();
    this.notUsedItems = await this.itemService.getAllItemsNotUsed();
  }

  openItemDetails(item: Item) {
    // TODO: Implement item details opening logic
  }
}
