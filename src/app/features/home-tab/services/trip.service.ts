import { inject, Injectable } from '@angular/core';
import { TripRepository } from '@core/repositories/trip.repository';
import { Trip } from '@core/models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripService {
  private readonly tripRepository = inject(TripRepository);

  async createTestTrips() {
    await this.tripRepository.deleteAllTrips();
    const testTrips: Trip[] = [
      // Estatus 0: Futuro
      {
        id: 0,
        name: 'Aventura en las montañas',
        destination: 'Los Alpes, Suiza',
        travelers: 4,
        startDate: '2027-08-01',
        endDate: '2027-08-10',
        status: 0,
      },
      {
        id: 0,
        name: 'Visita a la familia',
        destination: 'Buenos Aires, Argentina',
        travelers: 3,
        startDate: '2026-03-15',
        endDate: '2026-03-25',
        status: 0,
      },
      {
        id: 0,
        name: 'Vacaciones de invierno',
        destination: 'Tokio, Japón',
        travelers: 3,
        startDate: '2026-01-15',
        endDate: '2026-01-25',
        status: 0,
      },

      // Estatus 1: Actual
      {
        id: 0,
        name: 'Conferencia de trabajo',
        destination: 'Nueva York, EE.UU.',
        travelers: 1,
        startDate: '2026-01-01',
        endDate: '2026-01-30',
        status: 1,
      },

      // Estatus 2: Pasado
      {
        id: 0,
        name: 'Viaje a la playa',
        destination: 'Cancún, México',
        travelers: 2,
        startDate: '2023-12-15',
        endDate: '2023-12-20',
        status: 2,
      },
      {
        id: 0,
        name: 'Escapada de fin de semana',
        destination: 'Barcelona, España',
        travelers: 1,
        startDate: '2020-05-10',
        endDate: '2020-05-12',
        status: 2,
      },
      {
        id: 0,
        name: 'Tour por Europa',
        destination: 'París, Roma, Berlín',
        travelers: 5,
        startDate: '2025-12-20',
        endDate: '2025-12-31',
        status: 2,
      },
      {
        id: 0,
        name: 'Exploración cultural',
        destination: 'El Cairo, Egipto',
        travelers: 2,
        startDate: '2025-011-05',
        endDate: '2025-11-15',
        status: 2,
      },
      {
        id: 0,
        name: 'Safari en África',
        destination: 'Nairobi, Kenia',
        travelers: 3,
        startDate: '2025-06-01',
        endDate: '2025-06-10',
        status: 2,
      },
    ];

    for (const trip of testTrips) {
      await this.tripRepository.addTrip(trip);
    }
  }

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
