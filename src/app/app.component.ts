import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';
import { DatabaseService } from '@core/services/database.service';
import { LoadingService } from '@core/services/loading.service';
import { FocusManagerService } from '@core/services/focus-manager.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private databaseService = inject(DatabaseService);
  private loadingService = inject(LoadingService);
  private focusManagerService = inject(FocusManagerService);
  private router = inject(Router);

  loading$ = this.loadingService.loading$;
  message$ = this.loadingService.message$;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.focusManagerService.clearActiveElement();
      });
  }

  async ngOnInit() {
    this.loadingService.show('Iniciando base de datos...');
    await this.databaseService.init();
    this.loadingService.hide();

    if (!environment.production) {
      (window as unknown as { db: DatabaseService }).db = this.databaseService;
    }
  }
}
