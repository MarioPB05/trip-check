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

  currentTrips: CurrentTripDetails[] = [];
  futureTrips: Trip[] = [];
  pastTrips: Trip[] = [];

  async ngOnInit() {
    try {
      this.currentTrips = await this.tripService.getAllCurrentTrips();
      this.pastTrips = await this.tripService.getAllPastTrips();
      this.futureTrips = await this.tripService.getAllFutureTrips();
    } catch (error) {
      console.error('Error loading trips in HomeTabComponent:', error);
      // TODO: Implement user-friendly error handling (e.g., show a toast notification)
    }
  }
}
