import { Component, Input } from '@angular/core';
import { Location, LocationItem } from '@core/models/location.model';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-location-items',
  templateUrl: './location-items.component.html',
  styleUrls: ['./location-items.component.scss'],
  imports: [ItemCardComponent],
})
export class LocationItemsComponent {
  @Input() location!: Location;
  @Input() items: LocationItem[] = [];
}
