import { Component, Input } from '@angular/core';
import { StatCard } from '@core/interfaces/Stats';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
  imports: [NgClass],
})
export class StatCardComponent {
  @Input() data!: StatCard;
}
