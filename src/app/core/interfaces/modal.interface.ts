import { LucideIconData } from 'lucide-angular';
import { Item } from '@core/models/item.model';

export interface MenuItem {
  label: string;
  action: (item: Item) => void | Promise<void>;
  icon: LucideIconData;
  dangerous?: boolean;
}
