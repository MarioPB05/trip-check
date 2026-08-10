import { Item } from '@core/models/item.model';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { ItemService } from '@features/item-details/service/item.service';

export const itemResolver: ResolveFn<Item | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const itemService = inject(ItemService);
  const itemId = Number(route.paramMap.get('itemId'));
  return itemService.getItemById(itemId);
};
