import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { IonContent, IonSearchbar } from '@ionic/angular/standalone';
import { ItemService } from '@features/item-tab/services/item.service';
import { Item, ItemWithUsages } from '@core/models/item.model';
import { ItemCardComponent } from '@shared/components/item-card/item-card.component';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { Router } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { LucideAngularModule, Plus, Search } from 'lucide-angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { ErrorModalService } from '@core/services/errorModal.service';
import { ErrorInterface } from '@core/interfaces/error.interface';
import { ServerError } from '@core/consts/error.consts';

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
  private readonly router = inject(Router);
  private readonly itemService = inject(ItemService);
  private readonly loadingService = inject(LoadingService);
  private readonly errorModalService = inject(ErrorModalService);
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

  async openItemDetails(item: Item) {
    await this.router.navigate(['/tabs/items', item.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadItems(): Promise<void> {
    try {
      this.loadingService.show('Cargando objetos...');
      this.originalItems.set(await this.itemService.getAllItems());
    } catch (error) {
      const errorMessage: ErrorInterface = {
        ...ServerError,
        message: 'No se pudieron cargar los objetos. Por favor, inténtalo de nuevo más tarde.',
      };

      await this.errorModalService.show(errorMessage);
    } finally {
      this.loadingService.hide();
    }
  }
}
