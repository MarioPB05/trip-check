import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TripButtonComponent } from '../trip-button/trip-button.component';
import { LucideAngularModule, MinusIcon, PlusIcon } from 'lucide-angular';

@Component({
  selector: 'app-quantity-counter',
  templateUrl: './quantity-counter.component.html',
  styleUrls: ['./quantity-counter.component.scss'],
  imports: [TripButtonComponent, LucideAngularModule],
})
export class QuantityCounterComponent {
  protected readonly PlusIcon = PlusIcon;
  protected readonly MinusIcon = MinusIcon;

  @Input() min: number = 0;
  @Input() quantity: number = 1;
  @Output() quantityChange = new EventEmitter<number>();

  protected isInvalid: boolean = false;
  protected max: number = 9999;

  increment() {
    if (this.quantity < this.max) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
      this.setInvalidity(this.quantity);
    }
  }

  decrement() {
    if (this.quantity > this.min) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
      this.setInvalidity(this.quantity);
    }
  }

  setInvalidity(value: number) {
    this.isInvalid = isNaN(value) || value < this.min || value > this.max;
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const numericValue = Number(value);
    this.setInvalidity(numericValue);

    if (!this.isInvalid) {
      this.quantity = numericValue;
      this.quantityChange.emit(numericValue);
    }
  }
}
