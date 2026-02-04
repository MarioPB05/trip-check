import { Component } from '@angular/core';
import { Briefcase, Info, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-no-templates-alert',
  templateUrl: './no-templates-alert.component.html',
  styleUrls: ['./no-templates-alert.component.scss'],
  imports: [LucideAngularModule],
})
export class NoTemplatesAlertComponent {
  constructor() {}

  protected readonly Briefcase = Briefcase;
  protected readonly Info = Info;
}
