import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '@core/models/trip.model';
import { LucideAngularModule } from 'lucide-angular';
import { DateUtility } from '@core/utilities/date.utility';

@Component({
  selector: 'app-future-trip',
  standalone: true,
  templateUrl: './future-trip.component.html',
  styleUrls: ['./future-trip.component.scss'],
  imports: [LucideAngularModule],
})
export class FutureTripComponent implements OnInit {
  @Input() trip!: Trip;

  relativeStartDate: string = 'En ';
  duration: string = '';

  ngOnInit() {
    const today = new Date();
    const startDate = DateUtility.stringToDate(this.trip.startDate);
    const endDate = DateUtility.stringToDate(this.trip.endDate);

    const daysUntilStart = DateUtility.dateDifferenceInDays(today, startDate);
    this.relativeStartDate += DateUtility.daysToBestFormattedString(daysUntilStart);

    if (daysUntilStart < 1) {
      this.relativeStartDate = 'En curso';
    }

    const tripDurationInDays = DateUtility.dateDifferenceInDays(startDate, endDate);
    this.duration = DateUtility.daysToBestFormattedString(tripDurationInDays);
  }
}
