import { inject, Injectable } from '@angular/core';
import { ItemRepository } from '@core/repositories/item.repository';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly itemRepository = inject(ItemRepository);

  async getAllItems() {
    return await this.itemRepository.getAllItems();
  }
}
