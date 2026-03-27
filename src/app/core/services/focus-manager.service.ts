import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FocusManagerService {
  constructor(private router: Router) {
    this.initializeFocusHandling();
  }

  private initializeFocusHandling(): void {
    // Subscription intentionally not unsubscribed: this service is a root singleton
    // that lives for the entire application lifetime.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.clearActiveElement();
      });
  }

  private clearActiveElement(): void {
    const activeElement = document.activeElement as HTMLElement | null;

    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
  }
}
