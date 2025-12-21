import { Component, inject, OnInit } from '@angular/core';
import { DatabaseService } from '@core/services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private databaseService = inject(DatabaseService);

  constructor() {}

  async ngOnInit() {
    await this.databaseService.init();
  }
}
