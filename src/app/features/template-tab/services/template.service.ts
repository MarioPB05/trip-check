import { inject, Injectable } from '@angular/core';
import { TemplateRepository } from '@core/repositories/template.repository';
import { Template } from '@core/models/template.model';
import { EmojiService } from '@core/services/emoji.service';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly templateRepo = inject(TemplateRepository);
  private readonly emojiService = inject(EmojiService);

  async createTestTemplates() {
    await this.templateRepo.createTemplate('Viaje a la playa');
    await this.templateRepo.createTemplate('Excursión de montaña');
    await this.templateRepo.createTemplate('Viaje de negocios');

    // Add items to "Viaje a la playa"
    await this.templateRepo.addItemToTemplate(1, 1, 2); // 2 Sunscreen
    await this.templateRepo.addItemToTemplate(1, 2, 1); // 1 Beach Towel
    await this.templateRepo.addItemToTemplate(1, 3, 1); // 1 Swimsuit

    // Add items to "Excursión de montaña"
    await this.templateRepo.addItemToTemplate(2, 4, 1); // 1 Hiking Boots
    await this.templateRepo.addItemToTemplate(2, 5, 1); // 1 Backpack
    await this.templateRepo.addItemToTemplate(2, 6, 1); // 1 Water Bottle

    // Add items to "Viaje de negocios"
    await this.templateRepo.addItemToTemplate(3, 7, 2);
    await this.templateRepo.addItemToTemplate(3, 8, 1);
    await this.templateRepo.addItemToTemplate(3, 9, 1);
  }

  async getAllTemplates() {
    let templates: Template[] = await this.templateRepo.getAllTemplates();

    // Convert emojis to emoji URLs
    templates = templates.map((template) => {
      template.items = template.items.map((itemWithQuantity) => {
        itemWithQuantity.item.emojiUrl = this.emojiService.getEmojiUrl(
          itemWithQuantity.item.emojiUrl || '',
        );
        return itemWithQuantity;
      });
      return template;
    });

    return templates;
  }
}
