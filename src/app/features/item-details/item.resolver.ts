import { Item } from '@core/models/item.model';
import type { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ItemService } from '@features/item-details/service/item.service';

export const itemResolver: ResolveFn<Item | null> = (route: ActivatedRouteSnapshot) => {
  const itemService = inject(ItemService);
  const rawItemId = route.paramMap.get('itemId');
  const itemId = rawItemId ? Number(rawItemId) : NaN;

  if (!Number.isFinite(itemId)) return null;

  return itemService.getItemById(itemId);
};
