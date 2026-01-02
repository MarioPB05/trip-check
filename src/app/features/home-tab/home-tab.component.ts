import { IonContent } from '@ionic/angular/standalone';
import { Component, inject, OnInit } from '@angular/core';
import { CurrentTripComponent } from '@features/home-tab/components/current-trip/current-trip.component';
import { FutureTripComponent } from '@features/home-tab/components/future-trip/future-trip.component';
import { PastTripComponent } from '@features/home-tab/components/past-trip/past-trip.component';
import { CurrentTripDetails, Trip } from '@core/models/trip.model';
import { NoTripsAlertComponent } from '@features/home-tab/components/no-trips-alert/no-trips-alert.component';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { TripService } from '@features/home-tab/services/trip.service';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.component.html',
  styleUrls: ['./home-tab.component.scss'],
  imports: [
    IonContent,
    CurrentTripComponent,
    FutureTripComponent,
    PastTripComponent,
    NoTripsAlertComponent,
    TripButtonComponent,
    LucideAngularModule,
  ],
})
export class HomeTabComponent implements OnInit {
  protected readonly Plus = Plus;
  private readonly tripService = inject(TripService);
  private readonly loadingService = inject(LoadingService);

  currentTrips: CurrentTripDetails[] = [];
  futureTrips: Trip[] = [];
  pastTrips: Trip[] = [];

  organizedFutureTrips: {
    key: string;
    trips: Trip[];
    maxDaysAhead: number;
  }[] = [
    { key: 'Este mes', trips: [], maxDaysAhead: 30 },
    { key: 'Próximo mes', trips: [], maxDaysAhead: 60 },
    { key: 'Más adelante', trips: [], maxDaysAhead: Infinity },
  ];

  organizedPastTrips: { key: string; trips: Trip[]; minDaysAgo: number }[] = [
    { key: 'Último mes', trips: [], minDaysAgo: 0 },
    { key: 'Hace más de un mes', trips: [], minDaysAgo: 31 },
    { key: 'Hace más de seis meses', trips: [], minDaysAgo: 181 },
    { key: 'Hace más de un año', trips: [], minDaysAgo: 366 },
  ];

  async ngOnInit() {
    try {
      this.loadingService.show('Cargando viajes...');
      this.currentTrips = await this.tripService.getAllCurrentTrips();
      this.pastTrips = await this.tripService.getAllPastTrips();
      this.futureTrips = await this.tripService.getAllFutureTrips();
      this.organizeTrips();
    } catch (error) {
      console.error('Error loading trips in HomeTabComponent:', error);
      // TODO: Implement user-friendly error handling (e.g., show a toast notification)
    } finally {
      this.loadingService.hide();
    }
  }

  private getDaysUntilTripStarts(trip: Trip): number {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const timeDiff = startDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  private getDaysSinceTripEnded(trip: Trip): number {
    const today = new Date();
    const endDate = new Date(trip.endDate);
    const timeDiff = today.getTime() - endDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  protected organizeTrips() {
    // Organize future trips
    this.organizedFutureTrips.forEach((category) => {
      category.trips = this.futureTrips.filter((trip) => {
        const daysAhead = this.getDaysUntilTripStarts(trip);
        return daysAhead <= category.maxDaysAhead;
      });
    });

    // Organize past trips
    // Reverse pastTrips to categorize from most recent to oldest
    const reversedOrganizedPastTrips = [...this.organizedPastTrips].reverse();

    this.pastTrips.forEach((trip) => {
      const daysAgo = this.getDaysSinceTripEnded(trip);
      for (const category of reversedOrganizedPastTrips) {
        console.log(`Assigning trip ${trip.id} to category ${category.key}`);
        if (daysAgo >= category.minDaysAgo) {
          category.trips.push(trip);
          break;
        }
      }
    });

    // Filter out empty categories
    this.organizedPastTrips = this.organizedPastTrips.filter(
      (category) => category.trips.length > 0,
    );

    this.organizedFutureTrips = this.organizedFutureTrips.filter(
      (category) => category.trips.length > 0,
    );
  }
}
