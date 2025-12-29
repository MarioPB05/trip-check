import { Component, Input, OnInit } from '@angular/core';
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

  @Input() trip!: Trip;
  duration: string = '';

  onViewDetailsClick() {
    console.log('Ver detalles del viaje clicked');
  }
}
