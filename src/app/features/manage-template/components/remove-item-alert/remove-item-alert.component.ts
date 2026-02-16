import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertButton, IonAlert } from '@ionic/angular/standalone';
import { AlertInput } from '@ionic/angular';

@Component({
  selector: 'app-remove-item-alert',
  templateUrl: './remove-item-alert.component.html',
  styleUrls: ['./remove-item-alert.component.scss'],
  imports: [IonAlert],
})
export class RemoveItemAlertComponent {
  @Input() isAlertOpen = false;
  @Input() itemId!: number;

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
      text: 'Quitar',
      role: 'confirm',
      handler: () => {
        this.confirmed.emit();
      },
    },
  ];
  alertInputs: AlertInput[] = [
    {
      label: 'No preguntarme de nuevo',
      type: 'checkbox',
      value: 'noAskAgain',
      cssClass: 'color-medium-to-children',
    },
  ];
}
