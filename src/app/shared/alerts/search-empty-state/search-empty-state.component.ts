import { Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData, Search } from 'lucide-angular';

@Component({
  selector: 'app-search-empty-state',
  templateUrl: './search-empty-state.component.html',
  styleUrls: ['./search-empty-state.component.scss'],
  imports: [LucideAngularModule],
})
export class SearchEmptyStateComponent {
  protected readonly Search = Search;

  @Input() hasIcon: boolean = true;
  @Input() fullMessage = '';
  @Input() target = '';
}
