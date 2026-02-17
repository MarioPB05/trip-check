import { inject, Injectable } from '@angular/core';
import { ItemRepository } from '@core/repositories/item.repository';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly itemRepository: ItemRepository = inject(ItemRepository);

  async getPaginatedFilteredItems(searchTerm: string, limit: number, offset: number) {
    return await this.itemRepository.getItemsFilteredAndPaginated(searchTerm, limit, offset);
  }
}
