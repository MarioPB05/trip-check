import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertButton, IonAlert } from '@ionic/angular/standalone';

@Component({
  selector: 'app-delete-template-alert',
  templateUrl: './delete-template-alert.component.html',
  styleUrls: ['./delete-template-alert.component.scss'],
  imports: [IonAlert],
})
export class DeleteTemplateAlertComponent {
  @Input() isAlertOpen = false;

  @Output() confirmed: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();

  alertButtons: AlertButton[] = [
    {
      text: 'Cancelar',
      cssClass: 'color-medium',
      role: 'cancel',
      handler: () => {
        this.cancelled.emit();
      },
    },
    {
      text: 'Eliminar',
      role: 'confirm',
      cssClass: 'color-danger',
      handler: () => {
        this.confirmed.emit();
      },
    },
  ];
}
