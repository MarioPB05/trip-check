import { Component, OnInit } from '@angular/core';
import { Trip } from '@core/models/trip.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-future-trip',
  templateUrl: './future-trip.component.html',
  styleUrls: ['./future-trip.component.scss'],
  imports: [LucideAngularModule],
})
export class FutureTripComponent {
  trip: Trip = {
    id: 2,
    name: 'Viaje a la montaña',
    destination: 'Los Andes',
    travelers: 4,
    startDate: '10-5-2025',
    endDate: '17-5-2025',
    status: 0,
  };

  relativeStartDate: string = 'en 3 meses';
  duration: string = '7 días';
}
