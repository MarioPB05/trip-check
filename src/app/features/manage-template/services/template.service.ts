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
}
