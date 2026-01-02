import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '@core/models/trip.model';
import { Briefcase, LucideAngularModule } from 'lucide-angular';
import { DateUtility } from '@core/utilities/date.utility';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';

@Component({
  selector: 'app-future-trip',
  standalone: true,
  templateUrl: './future-trip.component.html',
  styleUrls: ['./future-trip.component.scss'],
  imports: [LucideAngularModule, TripButtonComponent],
})
export class FutureTripComponent implements OnInit {
  protected readonly Briefcase = Briefcase;

  @Input() trip!: Trip;

  duration: string = '';

  ngOnInit() {
    const startDate = DateUtility.stringToDate(this.trip.startDate);
    const endDate = DateUtility.stringToDate(this.trip.endDate);

    const tripDurationInDays = DateUtility.dateDifferenceInDays(startDate, endDate);
    this.duration = DateUtility.daysToBestFormattedString(tripDurationInDays);
  }

  onPlanTripClick() {
    // TODO: Redirect to trip planning page
  }
}
