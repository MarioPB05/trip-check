import { IonContent } from '@ionic/angular/standalone';
import { Component } from '@angular/core';
import { CurrentTripComponent } from '@features/home-tab/components/current-trip/current-trip.component';
import { FutureTripComponent } from '@features/home-tab/components/future-trip/future-trip.component';
import { PastTripComponent } from '@features/home-tab/components/past-trip/past-trip.component';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.component.html',
  styleUrls: ['./home-tab.component.scss'],
  imports: [IonContent, CurrentTripComponent, FutureTripComponent, PastTripComponent],
})
export class HomeTabComponent {
  constructor() {}
}
