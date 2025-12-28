import { Component, Input, OnInit } from '@angular/core';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { TripButtonComponent } from '../../../../shared/components/trip-button/trip-button.component';
import { ChevronRight, LucideAngularModule } from 'lucide-angular';
import { CurrentTripDetails, Trip } from '@core/models/trip.model';

@Component({
  selector: 'app-current-trip',
  templateUrl: './current-trip.component.html',
  styleUrls: ['./current-trip.component.scss'],
  imports: [StatCardComponent, TripButtonComponent, LucideAngularModule],
})
export class CurrentTripComponent {
  protected readonly ChevronRight = ChevronRight;

  @Input() trip: CurrentTripDetails = {
    id: 1,
    name: 'Viaje a la playa',
    destination: 'Cancún',
    travelers: 2,
    startDate: '12-2-2025',
    endDate: '19-2-2025',
    status: 1,
    numberOfLocations: 5,
    numberOfItems: 20,
  };

  duration: string = '7 días';

  onContinueClick() {
    console.log('Continuar viaje clicked');
  }
}
