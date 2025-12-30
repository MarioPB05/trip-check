import { Component, Input, OnInit } from '@angular/core';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { ChevronRight, LucideAngularModule } from 'lucide-angular';
import { Trip } from '@core/models/trip.model';
import { DateUtility } from '@core/utilities/date.utility';

@Component({
  selector: 'app-past-trip',
  templateUrl: './past-trip.component.html',
  styleUrls: ['./past-trip.component.scss'],
  imports: [TripButtonComponent, LucideAngularModule],
})
export class PastTripComponent implements OnInit {
  protected readonly ChevronRight = ChevronRight;

  @Input() trip!: Trip;
  duration: string = '';

  ngOnInit() {
    const startDate = DateUtility.stringToDate(this.trip.startDate);
    const endDate = DateUtility.stringToDate(this.trip.endDate);

    const tripDurationInDays = DateUtility.dateDifferenceInDays(startDate, endDate);
    this.duration = DateUtility.daysToBestFormattedString(tripDurationInDays);
  }

  onViewDetailsClick() {
    console.log('Ver detalles del viaje clicked');
  }
}
