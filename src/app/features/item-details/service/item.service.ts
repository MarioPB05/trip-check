import { inject, Injectable } from '@angular/core';
import { ItemStats } from '@core/models/item.model';
import { NumberUtility } from '@core/utilities/number.utility';
import { ItemRepository } from '@core/repositories/item.repository';
import { TripRepository } from '@core/repositories/trip.repository';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly itemRepository = inject(ItemRepository);
  private readonly tripRepository = inject(TripRepository);

  getItemById(itemId: number) {
    return this.itemRepository.getItemById(itemId);
  }

  async getItemStats(itemId: number): Promise<ItemStats> {
    const [totalQuantity, lostQuantity, completedTripsCount, completedTripsWithItemCount] =
      await Promise.all([
        this.itemRepository.getTotalQuantityThisYearInCompletedTrips(itemId),
        this.itemRepository.getLostQuantityInOngoingOrCompletedTrips(itemId),
        this.tripRepository.getCompletedTripsCount(),
        this.itemRepository.getCompletedTripsCountWithItem(itemId),
      ]);

    const usageFrequency: number | null =
      completedTripsCount > 0 ? (completedTripsWithItemCount * 100) / completedTripsCount : null;

    return {
      totalQuantity: NumberUtility.numberToCompactString(totalQuantity),
      lostQuantity: NumberUtility.numberToCompactString(lostQuantity),
      usageFrequency:
        usageFrequency === null ? '-' : NumberUtility.numberToPercentageString(usageFrequency),
    };
  }
}
