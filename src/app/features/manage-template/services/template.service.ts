import { inject, Injectable } from '@angular/core';
import { TemplateRepository } from '@core/repositories/template.repository';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private readonly templateRepository: TemplateRepository = inject(TemplateRepository);

  /*
   * Crea una nueva plantilla con el nombre dado y los items especificados.
   *
   * @param name El nombre de la plantilla a crear.
   * @param quantityByItemId Un mapa que asocia cada ID de item con su cantidad correspondiente en la plantilla.
   */
  async createTemplate(name: string, quantityByItemId: Map<number, number>): Promise<void> {
    const templateId = await this.templateRepository.createTemplate(name);

    if (!templateId) {
      throw new Error('Failed to create template');
    }

    for (const [itemId, quantity] of quantityByItemId.entries()) {
      await this.templateRepository.addItemToTemplate(templateId, itemId, quantity);
    }
  }

  async updateTemplate(
    templateId: number,
    name: string,
    quantityByItemId: Map<number, number>,
  ): Promise<void> {
    await this.templateRepository.updateTemplateName(templateId, name);

    const existingItems = await this.templateRepository.getItemsByTemplateId(templateId);
    const existingItemMap = new Map(existingItems.map((i) => [i.itemId, i.quantity]));

    const removePromises: Promise<any>[] = [];
    const updatePromises: Promise<any>[] = [];
    const addPromises: Promise<any>[] = [];

    // Procesar eliminación
    for (const existingItemId of existingItemMap.keys()) {
      if (!quantityByItemId.has(existingItemId)) {
        removePromises.push(
          this.templateRepository.removeItemFromTemplate(templateId, existingItemId),
        );
      }
    }

    // Procesar agregar/actualizar
    for (const [itemId, quantity] of quantityByItemId.entries()) {
      if (existingItemMap.has(itemId)) {
        // Solo actualizar si la cantidad cambió
        const existingQuantity = existingItemMap.get(itemId)!;
        if (existingQuantity !== quantity) {
          updatePromises.push(
            this.templateRepository.updateItemQuantity(templateId, itemId, quantity),
          );
        }
      } else {
        addPromises.push(this.templateRepository.addItemToTemplate(templateId, itemId, quantity));
      }
    }

    // Ejecutar todas las operaciones en paralelo
    await Promise.all([...removePromises, ...updatePromises, ...addPromises]);
  }

  async getTemplateById(id: number) {
    return await this.templateRepository.getTemplateById(id);
  }
}
