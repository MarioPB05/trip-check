import { Component, Input, OnInit } from '@angular/core';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { ChevronRight, LucideAngularModule } from 'lucide-angular';
import { CurrentTripDetails, Trip } from '@core/models/trip.model';
import { CurrentTripDetails } from '@core/models/trip.model';

@Component({
  selector: 'app-current-trip',
  standalone: true,
  templateUrl: './current-trip.component.html',
  styleUrls: ['./current-trip.component.scss'],
  imports: [StatCardComponent, TripButtonComponent, LucideAngularModule],
})
export class CurrentTripComponent {
  protected readonly ChevronRight = ChevronRight;

  @Input() trip!: CurrentTripDetails;
  duration: string = '';

  duration: string = '7 días';

  onContinueClick() {
    console.log('Continuar viaje clicked');
  }
}
