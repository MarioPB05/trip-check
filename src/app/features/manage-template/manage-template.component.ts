import { Component, inject, signal } from '@angular/core';
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
import { LucideAngularModule, Plus, Save, Search, Shirt } from 'lucide-angular';
import { RemoveItemAlertComponent } from '@features/manage-template/components/remove-item-alert/remove-item-alert.component';
import { SearchItemsModalComponent } from '@features/manage-template/components/search-items-modal/search-items-modal.component';
import { PreferencesService } from '@core/services/preferences.service';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '@core/services/loading.service';
import { TemplateService } from '@features/manage-template/services/template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationToastService } from '@core/services/navigationToast.service';
import { Template } from '@core/models/template.model';
import { ViewWillEnter } from '@ionic/angular';
import { ErrorModalService } from '@core/services/errorModal.service';
import { GeneralError, ServerError, ValidationError } from '@core/consts/error.consts';

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
    FormsModule,
  ],
})
export class ManageTemplateComponent implements ViewWillEnter {
  protected readonly searchIcon = Search;
  protected readonly saveIcon = Save;
  protected readonly plusIcon = Plus;
  protected readonly shirtIcon = Shirt;

  private readonly preferencesService = inject(PreferencesService);
  private readonly loadingService = inject(LoadingService);
  private readonly templateService: TemplateService = inject(TemplateService);
  private readonly router: Router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly navigationToastService = inject(NavigationToastService);
  private readonly errorModalService = inject(ErrorModalService);

  isSearchModalOpen = false;

  isRemoveItemAlertSuppressed = false;
  isRemoveItemAlertOpen = false;
  selectedItemToRemove: Item | null = null;

  // Si es edit mode
  protected _template = signal<Template | null>(null);

  // Campos de la plantilla
  protected name: string = '';
  protected selectedItems: Map<number, Item> = new Map<number, Item>();
  protected quantityByItemId: Map<number, number> = new Map<number, number>();

  async ionViewWillEnter(): Promise<void> {
    this.initializeTemplateMode();
    await this.loadPreferences();
  }

  private initializeTemplateMode(): void {
    const resolvedTemplate = this.route.snapshot.data['template'] as Template | undefined;

    if (resolvedTemplate) {
      this._template.set(resolvedTemplate);
      this.setAllTemplateFields(resolvedTemplate);
      return;
    }

    this._template.set(null);
    this.emptyAllTemplateFields();
  }

  private async loadPreferences(): Promise<void> {
    const value = await this.preferencesService.get<boolean>('suppressRemoveItemAlert');
    this.isRemoveItemAlertSuppressed = value ?? false;
  }

  setAllTemplateFields(template: Template): void {
    this.name = template.name;
    template.items.forEach((templateItem) => {
      this.selectedItems.set(templateItem.item.id, templateItem.item);
      this.quantityByItemId.set(templateItem.item.id, templateItem.quantity);
    });
  }

  emptyAllTemplateFields(): void {
    this.name = '';
    this.selectedItems.clear();
    this.quantityByItemId.clear();
  }

  get isEditMode(): boolean {
    return this._template() !== null;
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

    const errorMessage = {
      ...GeneralError,
      message:
        'No se pudo guardar tu preferencia para suprimir la alerta de eliminación. Por favor, inténtalo de nuevo más tarde.',
    };

    if (this.isRemoveItemAlertSuppressed) {
      this.preferencesService.set('suppressRemoveItemAlert', true).catch(async () => {
        this.isRemoveItemAlertSuppressed = false;
        await this.errorModalService.show(errorMessage);
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

  protected async handleSaveTemplate() {
    if (!this.name.trim()) {
      const errorMessage = {
        ...ValidationError,
        message: 'El nombre de la plantilla no puede estar vacío.',
      };

      await this.errorModalService.show(errorMessage);
      return;
    }

    if (this.isEditMode) {
      await this.updateTemplate();
      return;
    }

    await this.createTemplate();
  }

  private async createTemplate(): Promise<void> {
    try {
      this.loadingService.show('Creando plantilla...');

      await this.templateService.createTemplate(this.name, this.quantityByItemId);

      this.navigateToTemplateList('Plantilla creada exitosamente');
    } catch (error) {
      const errorMessage = {
        ...ServerError,
        message: 'No se pudo crear la plantilla. Por favor, inténtalo de nuevo más tarde.',
      };

      await this.errorModalService.show(errorMessage);
    } finally {
      this.loadingService.hide();
    }
  }

  private async updateTemplate(): Promise<void> {
    try {
      this.loadingService.show('Actualizando plantilla...');

      await this.templateService.updateTemplate(
        this._template()!.id,
        this.name,
        this.quantityByItemId,
      );

      this.navigateToTemplateList('Plantilla actualizada exitosamente');
    } catch (error) {
      const errorMessage = {
        ...ServerError,
        message: 'No se pudo actualizar la plantilla. Por favor, inténtalo de nuevo más tarde.',
      };

      await this.errorModalService.show(errorMessage);
    } finally {
      this.loadingService.hide();
    }
  }

  private navigateToTemplateList(message: string): void {
    this.navigationToastService.setToast('success', message);
    this.router.navigate(['/tabs/templates']);
  }
}
