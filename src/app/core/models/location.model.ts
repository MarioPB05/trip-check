import { Trip } from '@core/models/trip.model';
import { Item } from '@core/models/item.model';
import { Template } from '@core/models/template.model';

export interface Location {
  id: number;
  name: string;
  trip: Trip;
  template?: Template;
}

export interface LocationItem {
  startLocation: Location;
  endLocation: Location;
  item: Item;
  quantity: number;
  added: number;
  lost: number;
  uses: number;
}
