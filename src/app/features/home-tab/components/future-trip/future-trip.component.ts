import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '@core/models/trip.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-future-trip',
  standalone: true,
  templateUrl: './future-trip.component.html',
  styleUrls: ['./future-trip.component.scss'],
  imports: [LucideAngularModule],
})
  @Input() trip!: Trip;

    if (daysUntilStart < 1) {
      this.relativeStartDate = 'En curso';
    }

    const tripDurationInDays = DateUtility.dateDifferenceInDays(startDate, endDate);
    this.duration = DateUtility.daysToBestFormattedString(tripDurationInDays);
  }
}
