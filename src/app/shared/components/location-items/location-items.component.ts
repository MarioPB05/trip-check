import { Component, Input } from '@angular/core';
import { Location } from '@core/models/location.model';
import { ItemCardComponent } from '@shared/components/item-card/item-card.component';
import { ItemWithQuantity } from '@core/models/item.model';
import { Template } from '@core/models/template.model';
import { LucideAngularModule, Shirt } from 'lucide-angular';

@Component({
  selector: 'app-location-items',
  templateUrl: './location-items.component.html',
  styleUrls: ['./location-items.component.scss'],
  imports: [ItemCardComponent, LucideAngularModule],
})
export class LocationItemsComponent {
  protected readonly shirtIcon = Shirt;

  @Input() location!: Location | Template;
  @Input() items: ItemWithQuantity[] = [];
}
