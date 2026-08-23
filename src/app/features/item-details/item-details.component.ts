import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPopover,
  IonTitle,
  IonToolbar,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Item, ItemStats } from '@core/models/item.model';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LucideAngularModule, Save, Share, Trash2 } from 'lucide-angular';
import { Picker } from 'emoji-picker-element';
import es from 'emoji-picker-element/i18n/es';
import { NgOptimizedImage } from '@angular/common';
import { EmojiService } from '@core/services/emoji.service';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { ItemService } from './service/item.service';
import { ErrorInterface } from '@core/interfaces/error.interface';
import { UnknownError } from '@core/consts/error.consts';
import { ErrorModalService } from '@core/services/errorModal.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    TripButtonComponent,
    LucideAngularModule,
    IonPopover,
    NgOptimizedImage,
    StatCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ItemDetailsComponent implements ViewWillEnter {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly itemService = inject(ItemService);
  private readonly emojiService = inject(EmojiService);
  private readonly errorModalService = inject(ErrorModalService);
  private readonly data = toSignal(this.route.data);

  private picker: Picker | null = null;

  protected item = computed(() => {
    const d = this.data();
    return (d?.['item'] as Item | null) ?? null;
  });
  protected readonly saveIcon = Save;
  protected readonly shareIcon = Share;
  protected readonly trashIcon = Trash2;

  protected selectedEmojiUrl = signal<string | null>(null);
  protected popover = viewChild<IonPopover>('popover');
  protected popoverContent = viewChild<ElementRef<HTMLDivElement>>('popoverContent');

  protected itemStats = signal<ItemStats>({
    totalQuantity: '-',
    lostQuantity: '-',
    usageFrequency: '-',
    rankingPosition: '-',
  });

  constructor() {
    effect(() => {
      const content = this.popoverContent()?.nativeElement;

      if (content) {
        this.picker = new Picker({
          i18n: es,
          locale: 'es',
          dataSource: 'assets/emojis.json',
        });

        content.prepend(this.picker);

        this.picker.addEventListener('emoji-click', (event) => {
          if (event.detail.unicode) {
            const emoji = event.detail.unicode as string;
            const emojiCode = this.emojiService.getEmojiCode(emoji);

            if (!emojiCode) {
              // TODO: Show error message
              return;
            }

            const emojiUrl = this.emojiService.getEmojiUrl(emojiCode);

            // Try fetch the emoji url to check if it exists
            fetch(emojiUrl)
              .then((response) => {
                if (!response.ok) {
                  // TODO: Show error message
                  throw new Error('Emoji not found');
                }

                return response.blob();
              })
              .then(() => {
                this.selectedEmojiUrl.set(emojiUrl);
              })
              .catch(() => {
                // TODO: Show error message
              });

            const popover = this.popover();

            if (popover) {
              popover.dismiss().then((result) => {
                if (!result) {
                  // TODO: Show error message
                }
              });
            }
          }
        });
      }
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadItemStats();
  }

  private async loadItemStats(): Promise<void> {
    try {
      const item = this.item();

      if (item) {
        const itemStats = await this.itemService.getItemStats(item.id);
        this.itemStats.set(itemStats);
      }
    } catch (error) {
      const errorMessage: ErrorInterface = {
        ...UnknownError,
        message:
          'No se pudieron cargar las estadísticas del objeto. Por favor, inténtalo de nuevo más tarde.',
      };

      await this.errorModalService.show(errorMessage);
    }
  }

  saveChanges() {
    // TODO: Save changes to the item
    this.router.navigate(['/tabs/items']);
  }
}
