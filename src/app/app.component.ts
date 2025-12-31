import { Component, inject, OnInit } from '@angular/core';
import { DatabaseService } from '@core/services/database.service';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private databaseService = inject(DatabaseService);
  private loadingService = inject(LoadingService);

  loading$ = this.loadingService.loading$;
  message$ = this.loadingService.message$;

  constructor() {}

  async ngOnInit() {
    this.loadingService.show('Iniciando base de datos...');
    await this.databaseService.init();
    this.loadingService.hide();
  }
}
