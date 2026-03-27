import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FocusManagerService {
  private readonly document = inject(DOCUMENT);

  clearActiveElement(): void {
    const activeElement = this.document.activeElement as HTMLElement | null;

    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
  }
}
