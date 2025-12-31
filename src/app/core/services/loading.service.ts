import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCounter = 0;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private messageSubject = new BehaviorSubject<string>('Cargando...');
  message$ = this.messageSubject.asObservable();

  show(message: string = 'Cargando...'): void {
    this.loadingCounter++;

    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingCounter = Math.max(this.loadingCounter - 1, 0);

    if (this.loadingCounter === 0) {
      this.loadingSubject.next(false);
    }
  }
}
