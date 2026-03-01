import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
import { LucideAngularModule, Search } from 'lucide-angular';
import { ServerError } from '@core/consts/error.consts';
import { ErrorModalService } from '@core/services/errorModal.service';

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
    LucideAngularModule,
  ],
})
export class SearchItemsModalComponent implements OnInit {
  protected readonly searchIcon = Search;
  private readonly itemsService: ItemService = inject(ItemService);
  private readonly errorModalService = inject(ErrorModalService);
  private readonly PAGE_SIZE = 20;

  @Input() selectedItems: Map<number, Item> = new Map<number, Item>();
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDeselected: EventEmitter<Item> = new EventEmitter<Item>();

  protected allItems: Item[] = [];

  protected searchControl = new FormControl('');
  protected allItemsLoaded = false;

  constructor() {}

  private async loadItems(searchTerm: string, limit: number, offset: number, append = false) {
    try {
      const newItems = await this.itemsService.getPaginatedFilteredItems(
        searchTerm ?? '',
        limit,
        offset,
      );

      if (append) {
        this.allItems = this.allItems.concat(newItems);
      } else {
        this.allItems = newItems;
      }

      if (newItems.length < limit) {
        this.allItemsLoaded = true;
      }
    } catch (error) {
      const errorMessage = {
        ...ServerError,
        message: 'No se pudieron cargar los objetos. Por favor, inténtalo de nuevo más tarde.',
      };

      await this.errorModalService.show(errorMessage);
    }
  }

  onSearchItem(searchTerm: string | null) {
    if (searchTerm === null) {
      searchTerm = '';
    }

    this.allItemsLoaded = false;
    this.allItems = [];

    this.loadItems(searchTerm, this.PAGE_SIZE, 0, false);
  }

  onItemClick(item: Item) {
    if (this.selectedItems.has(item.id)) {
      this.itemDeselected.emit(item);
    } else {
      this.itemSelected.emit(item);
    }
  }

  async onIonInfinite($event: any) {
    if (this.allItemsLoaded) {
      $event.target.complete();
      return;
    }

    await this.loadItems(
      this.searchControl.value ?? '',
      this.PAGE_SIZE,
      this.allItems.length,
      true,
    );

    $event.target.complete();
  }

  async ngOnInit() {
    await this.loadItems('', this.PAGE_SIZE, 0, false);

    // Listen to search input changes with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.onSearchItem(searchTerm);
      });
  }
}
