import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonSearchbar } from '@ionic/angular/standalone';
import { ItemService } from '@features/item-tab/services/item.service';
import { Item, ItemWithUsages } from '@core/models/item.model';
import { ItemCardComponent } from '@shared/components/item-card/item-card.component';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LoadingService } from '@core/services/loading.service';
import { LucideAngularModule, Plus, Search } from 'lucide-angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-item-tab',
  templateUrl: './item-tab.component.html',
  styleUrls: ['./item-tab.component.scss'],
  imports: [
    IonContent,
    ItemCardComponent,
    TripButtonComponent,
    LucideAngularModule,
    IonSearchbar,
    ReactiveFormsModule,
  ],
})
export class ItemTabComponent implements OnInit {
  private readonly itemService = inject(ItemService);
  private readonly loadingService = inject(LoadingService);

  protected originalItems: ItemWithUsages[] = [];
  protected usedItems: Item[] = [];
  protected notUsedItems: Item[] = [];
  protected searchControl = new FormControl('');
  protected readonly Plus = Plus;
  protected readonly searchIcon = Search;

  async ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.onSearchChange(searchTerm);
      });

    try {
      this.loadingService.show('Cargando objetos...');
      this.originalItems = await this.itemService.getAllItems();
      this.usedItems = this.originalItems.filter((item) => item.timesUsed > 1);
      this.notUsedItems = this.originalItems.filter((item) => item.timesUsed <= 0);
    } catch (error) {
      // TODO: Implement error handling logic
    } finally {
      this.loadingService.hide();
    }
  }

  openItemDetails(item: Item) {
    // TODO: Implement item details opening logic
  }

  onSearchChange(searchTerm: string | null) {
    if (searchTerm === null) {
      searchTerm = '';
    }

    const filterItems: ItemWithUsages[] = this.originalItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm),
    );

    this.notUsedItems = filterItems.filter((item) => item.timesUsed <= 0);
    this.usedItems = filterItems.filter((item) => item.timesUsed > 0);
  }
}
