import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgStyle } from '@angular/common';
import { AppColors } from '@core/types/colors.types';

@Component({
  selector: 'app-trip-button',
  templateUrl: './trip-button.component.html',
  styleUrls: ['./trip-button.component.scss'],
  imports: [NgStyle],
})
export class TripButtonComponent {
  @Input() type: AppColors = 'primary';
  @Input() class: string = '';
  @Input() fill: boolean = false;
  @Input() disabled: boolean = false;
  @Output() handleClick = new EventEmitter<Event>();

  typeColors: { [key in AppColors]: string } = {
    primary: 'var(--ion-color-primary)',
    secondary: 'var(--ion-color-secondary)',
    tertiary: 'var(--ion-color-tertiary)',
    success: 'var(--ion-color-success)',
    warning: 'var(--ion-color-warning)',
    danger: 'var(--ion-color-danger)',
    light: 'var(--ion-color-light)',
    medium: 'var(--ion-color-medium)',
    darkGray: 'var(--ion-color-dark-gray)',
    dark: 'var(--ion-color-dark)',
  };
}
