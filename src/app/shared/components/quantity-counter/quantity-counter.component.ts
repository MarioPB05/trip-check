import { Component } from '@angular/core';
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

  protected quantity: number = 1;
  protected min: number = 0;
  protected isInvalid: boolean = false;

  increment() {
    this.quantity++;
    this.setInvalidity(this.quantity);
  }

  decrement() {
    if (this.quantity > this.min) {
      this.quantity--;
      this.setInvalidity(this.quantity);
    }
  }

  setInvalidity(value: number) {
    this.isInvalid = isNaN(value) || value < this.min;
  }

  onInputChange(event: any) {
    const value = event.target.value;
    const numericValue = Number(value);
    this.setInvalidity(numericValue);
  }
}
