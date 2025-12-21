import { Item } from '@core/models/item.model';

export interface Template {
  id: number;
  name: string;
  items: TemplateItem[];
  deleted: boolean;
}

export interface TemplateItem {
  item: Item;
  quantity: number;
}
