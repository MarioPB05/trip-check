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

  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();

  isNoAskAgainChecked = false;

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
        this.confirmed.emit(this.isNoAskAgainChecked);
      },
    },
  ];
  alertInputs: AlertInput[] = [
    {
      label: 'Quitar siempre que llegue a 0',
      type: 'checkbox',
      value: 'noAskAgain',
      cssClass: 'color-medium-to-children',
      handler: (event: any) => {
        this.isNoAskAgainChecked = event.checked;
      },
    },
  ];
}
