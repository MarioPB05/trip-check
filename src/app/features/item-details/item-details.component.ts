import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
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
import { Router } from '@angular/router';
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
import { ServerError, UnknownError, ValidationError } from '@core/consts/error.consts';
import { ErrorModalService } from '@core/services/errorModal.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@core/services/toast.service';
import { LoadingService } from '@core/services/loading.service';

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
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ItemDetailsComponent implements ViewWillEnter {
  private readonly router = inject(Router);
  private readonly itemService = inject(ItemService);
  private readonly emojiService = inject(EmojiService);
  private readonly toastService = inject(ToastService);
  private readonly loadingService = inject(LoadingService);
  private readonly errorModalService = inject(ErrorModalService);

  private picker: Picker | null = null;

  protected item = input.required<Item>();
  protected readonly saveIcon = Save;
  protected readonly shareIcon = Share;
  protected readonly trashIcon = Trash2;

  protected updatedItemName = linkedSignal<string>(() => this.item().name);
  protected selectedEmojiCode = signal<string | undefined>(undefined);
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

            this.selectedEmojiCode.set(emojiCode);
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
      const itemStats = await this.itemService.getItemStats(this.item().id);
      this.itemStats.set(itemStats);
    } catch (error) {
      const errorMessage: ErrorInterface = {
        ...UnknownError,
        message:
          'No se pudieron cargar las estadísticas del objeto. Por favor, inténtalo de nuevo más tarde.',
      };

      await this.errorModalService.show(errorMessage);
    }
  }

  async saveChanges() {
    const item = this.item();
    const updatedName = this.updatedItemName().trim();

    if (updatedName.length === 0) {
      const errorMessage: ErrorInterface = {
        ...ValidationError,
        message: 'El nombre del objeto no puede estar vacío.',
      };

      await this.errorModalService.show(errorMessage);
      return;
    }

    try {
      await this.loadingService.show('Guardando cambios...');

      await this.itemService.updateItem(item.id, {
        name: updatedName,
        emojiCode: this.selectedEmojiCode(),
      });
    } catch (error) {
      const errorMessage: ErrorInterface = {
        ...ServerError,
        message: 'No se pudieron guardar los cambios. Por favor, inténtalo de nuevo más tarde.',
      };

      await this.errorModalService.show(errorMessage);
      return;
    } finally {
      this.loadingService.hide();
    }

    await this.router.navigate(['/tabs/items']);
    void this.toastService.show('Cambios guardados correctamente', 'success');
  }
}
