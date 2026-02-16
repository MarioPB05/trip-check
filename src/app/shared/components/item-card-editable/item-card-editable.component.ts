import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '@core/models/item.model';
import { QuantityCounterComponent } from '../quantity-counter/quantity-counter.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-item-card-editable',
  templateUrl: './item-card-editable.component.html',
  styleUrls: ['./item-card-editable.component.scss'],
  imports: [QuantityCounterComponent, NgOptimizedImage],
})
export class ItemCardEditableComponent {
  @Input() item!: Item;
  @Input() quantity: number = 1;
  @Input() helpText: string | null = null;
  @Output() cardClicked: EventEmitter<void> = new EventEmitter();
  @Output() quantityChange: EventEmitter<number> = new EventEmitter();
}
