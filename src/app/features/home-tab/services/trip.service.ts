import { inject, Injectable } from '@angular/core';
import { TripRepository } from '@core/repositories/trip.repository';

@Injectable({ providedIn: 'root' })
export class TripService {
  private readonly tripRepository = inject(TripRepository);

  async getAllCurrentTrips() {
    return await this.tripRepository.getAllCurrentTrips();
  }

  async getAllPastTrips() {
    return await this.tripRepository.getAllPastTrips();
  }

  async getAllFutureTrips() {
    return await this.tripRepository.getAllFutureTrips();
  }
}
