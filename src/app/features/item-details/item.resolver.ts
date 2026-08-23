import { Item } from '@core/models/item.model';
import {
  RedirectCommand,
  Router,
  type ActivatedRouteSnapshot,
  type ResolveFn,
} from '@angular/router';
import { inject } from '@angular/core';
import { ItemService } from '@features/item-details/service/item.service';
import { ErrorModalService } from '@core/services/errorModal.service';
import { NotFoundError, UnknownError } from '@core/consts/error.consts';
import { ErrorInterface } from '@core/interfaces/error.interface';

export const itemResolver: ResolveFn<Item> = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const itemService = inject(ItemService);
  const errorModalService = inject(ErrorModalService);
  const rawItemId = route.paramMap.get('itemId');
  const itemId = rawItemId ? Number(rawItemId) : NaN;
  const isValidItemId = Number.isFinite(itemId) && itemId > 0;
  const redirectWithError = (error: ErrorInterface) => {
    void errorModalService.show(error);
    return new RedirectCommand(router.parseUrl('/tabs/items'), { replaceUrl: true });
  };

  if (!isValidItemId) return redirectWithError(NotFoundError);

  try {
    const item = await itemService.getItemById(itemId);

    if (!item) return redirectWithError(NotFoundError);

    return item;
  } catch (error) {
    console.error('Error fetching item:', error);
    return redirectWithError(UnknownError);
  }
};
