import { Component, OnInit } from '@angular/core';
import { Briefcase, Info, LucideAngularModule, PlaneTakeoff, Plus } from 'lucide-angular';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';

@Component({
  selector: 'app-no-templates-alert',
  templateUrl: './no-templates-alert.component.html',
  styleUrls: ['./no-templates-alert.component.scss'],
  imports: [LucideAngularModule, TripButtonComponent],
})
export class NoTemplatesAlertComponent {
  constructor() {}

  protected readonly Briefcase = Briefcase;
  protected readonly Info = Info;
}
