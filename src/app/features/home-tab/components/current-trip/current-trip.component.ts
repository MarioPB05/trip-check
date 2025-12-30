import { Component, Input, OnInit } from '@angular/core';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { ChevronRight, LucideAngularModule } from 'lucide-angular';
import { CurrentTripDetails } from '@core/models/trip.model';
import { DateUtility } from '@core/utilities/date.utility';

@Component({
  selector: 'app-current-trip',
  standalone: true,
  templateUrl: './current-trip.component.html',
  styleUrls: ['./current-trip.component.scss'],
  imports: [StatCardComponent, TripButtonComponent, LucideAngularModule],
})
export class CurrentTripComponent implements OnInit {
  protected readonly ChevronRight = ChevronRight;

  @Input() trip!: CurrentTripDetails;
  duration: string = '';

  ngOnInit() {
    const startDate = DateUtility.stringToDate(this.trip.startDate);
    const endDate = DateUtility.stringToDate(this.trip.endDate);

    const tripDurationInDays = DateUtility.dateDifferenceInDays(startDate, endDate);
    this.duration = DateUtility.daysToBestFormattedString(tripDurationInDays);
  }

  onContinueClick() {
    console.log('Continuar viaje clicked');
  }
}
