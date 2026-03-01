import { Component, inject, Input } from '@angular/core';
import { ErrorInterface } from '@core/interfaces/error.interface';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import {
  CircleAlert,
  CircleX,
  ClockAlert,
  CloudAlert,
  LucideAngularModule,
  LucideIconData,
  SearchX,
  WifiOff,
} from 'lucide-angular';
import { ErrorType } from '@core/types/error.types';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  imports: [IonHeader, IonContent, LucideAngularModule],
})
export class ErrorModalComponent {
  protected readonly circleXIcon = CircleX;
  protected readonly cloudAlertIcon = CloudAlert;
  protected readonly clockAlertIcon = ClockAlert;
  protected readonly wifiOffIcon = WifiOff;
  protected readonly circleAlertIcon = CircleAlert;
  protected readonly searchXIcon = SearchX;

  private readonly modalController = inject(ModalController);

  @Input() errorData!: ErrorInterface;

  iconByErrorType: Record<ErrorType, LucideIconData> = {
    general: this.circleXIcon,
    network: this.wifiOffIcon,
    validation: this.circleAlertIcon,
    not_found: this.searchXIcon,
    server: this.cloudAlertIcon,
    timeout: this.clockAlertIcon,
    unknown: this.circleXIcon,
  };

  dismiss(): void {
    this.modalController.dismiss();
  }
}
