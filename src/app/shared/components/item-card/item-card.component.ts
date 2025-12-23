import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '@core/models/item.model';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent {
  @Input() item!: Item;
  @Input() quantity: number = -1;
  @Output() handleClick: EventEmitter<Item> = new EventEmitter();
}
