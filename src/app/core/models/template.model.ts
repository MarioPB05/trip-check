import { ItemWithQuantity } from '@core/models/item.model';

export interface Template {
  id: number;
  name: string;
  items: ItemWithQuantity[];
  deleted: boolean;
}
