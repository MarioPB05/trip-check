import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, PlaneTakeoff, Plus } from 'lucide-angular';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';

@Component({
  selector: 'app-no-trips-alert',
  templateUrl: './no-trips-alert.component.html',
  styleUrls: ['./no-trips-alert.component.scss'],
  imports: [LucideAngularModule, TripButtonComponent],
})
export class NoTripsAlertComponent {
  protected readonly PlaneTakeoff = PlaneTakeoff;
  protected readonly Plus = Plus;
}
