import { inject, Injectable } from '@angular/core';
import { ItemRepository } from '@core/repositories/item.repository';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly itemRepository = inject(ItemRepository);

  async getAllItemsUsed() {
    return await this.itemRepository.getAllItemsUsed();
  }

  async getAllItemsNotUsed() {
    return await this.itemRepository.getAllItemsNotUsed();
  }
}
