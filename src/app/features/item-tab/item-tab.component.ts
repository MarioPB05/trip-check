import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { IonContent, IonSearchbar } from '@ionic/angular/standalone';
import { ItemService } from '@features/item-tab/services/item.service';
import { Item, ItemWithUsages } from '@core/models/item.model';
import { ItemCardComponent } from '@shared/components/item-card/item-card.component';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LoadingService } from '@core/services/loading.service';
import { LucideAngularModule, Plus, Search } from 'lucide-angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

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
export class ItemTabComponent implements OnInit, OnDestroy {
  private readonly itemService = inject(ItemService);
  private readonly loadingService = inject(LoadingService);
  private readonly destroy$ = new Subject<void>();

  private readonly searchTerm = signal<string>('');

  protected readonly originalItems = signal<ItemWithUsages[]>([]);

  protected readonly usedItems = computed(() =>
    this.originalItems()
      .filter((item) => item.name.toLowerCase().includes(this.searchTerm()))
      .filter((item) => item.timesUsed > 0),
  );

  protected readonly unusedItems = computed(() =>
    this.originalItems()
      .filter((item) => item.name.toLowerCase().includes(this.searchTerm()))
      .filter((item) => item.timesUsed <= 0),
  );

  protected readonly searchControl = new FormControl('');
  protected readonly Plus = Plus;
  protected readonly searchIcon = Search;

  async ngOnInit(): Promise<void> {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => this.searchTerm.set(term?.toLowerCase() ?? ''));

    await this.loadItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openItemDetails(_item: Item): void {
    // TODO: Implement item details opening logic
  }

  private async loadItems(): Promise<void> {
    try {
      this.loadingService.show('Cargando objetos...');
      this.originalItems.set(await this.itemService.getAllItems());
    } catch (error) {
      // TODO: Implement error handling logic
      console.error('Error loading items:', error);
    } finally {
      this.loadingService.hide();
    }
  }
}
