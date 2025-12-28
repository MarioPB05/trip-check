import { Component, OnInit } from '@angular/core';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { ChevronRight, LucideAngularModule } from 'lucide-angular';
import { Trip } from '@core/models/trip.model';

@Component({
  selector: 'app-past-trip',
  templateUrl: './past-trip.component.html',
  styleUrls: ['./past-trip.component.scss'],
  imports: [TripButtonComponent, LucideAngularModule],
})
export class PastTripComponent {
  protected readonly ChevronRight = ChevronRight;

  trip: Trip = {
    id: 2,
    name: 'Viaje a la montaña',
    destination: 'Los Andes',
    travelers: 4,
    startDate: '01-05-2023',
    endDate: '10-05-2023',
    status: 2,
  };
  duration: string = '10 días';

  onViewDetailsClick() {
    console.log('Ver detalles del viaje clicked');
  }
}
