import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { ItemCardComponent } from '@shared/components/item-card/item-card.component';
import { Item } from '@core/models/item.model';
import { ItemService } from '@features/manage-template/services/item.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-items-modal',
  templateUrl: './search-items-modal.component.html',
  styleUrls: ['./search-items-modal.component.scss'],
  imports: [
    IonContent,
    IonModal,
    IonSearchbar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    ItemCardComponent,
    ReactiveFormsModule,
  ],
})
export class SearchItemsModalComponent implements OnInit {
  private readonly itemsService: ItemService = inject(ItemService);

  PAGE_SIZE = 20;

  protected items: Item[] = [];
  protected searchControl = new FormControl('');
  protected allItemsLoaded = false;

  private async loadItems(searchTerm: string, limit: number, offset: number, append = false) {
    try {
      const newItems = await this.itemsService.getPaginatedFilteredItems(
        searchTerm ?? '',
        limit,
        offset,
      );

      if (append) {
        this.items = this.items.concat(newItems);
      } else {
        this.items = newItems;
      }

      if (newItems.length < limit) {
        this.allItemsLoaded = true;
      }
    } catch (error) {
      // TODO: Handle error, show toast, etc.
      throw error;
    }
  }

  onSearchItem(searchTerm: string | null) {
    if (searchTerm === null) {
      searchTerm = '';
    }

    this.allItemsLoaded = false;
    this.items = [];

    this.loadItems(searchTerm, this.PAGE_SIZE, 0, false).catch((error) => {
      console.error(error);
      // TODO: Handle error, show toast, etc.
    });
  }

  async onIonInfinite($event: any) {
    if (this.allItemsLoaded) {
      $event.target.complete();
      return;
    }

    console.log('Loading more items...');

    try {
      await this.loadItems(
        this.searchControl.getRawValue() ?? '',
        this.PAGE_SIZE,
        this.items.length,
        true,
      ).catch((error) => {
        console.error(error);
        // TODO: Handle error, show toast, etc.
      });

      $event.target.complete();
    } catch (error) {
      // TODO: Handle error, show toast, etc.
    }
  }

  async ngOnInit() {
    try {
      await this.loadItems('', this.PAGE_SIZE, 0, false);
    } catch (error) {
      // TODO: Handle error, show toast, etc.
    }

    // Listen to search input changes with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        console.log('Search term changed:', searchTerm);
        this.onSearchItem(searchTerm);
      });
  }
}
