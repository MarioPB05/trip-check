import { Injectable } from '@angular/core';
import { ToastType } from '@core/types/toast.types';

@Injectable({ providedIn: 'root' })
export class NavigationToastService {
  private _toast: { type: ToastType; message: string } | null = null;

  setToast(type: ToastType, message: string) {
    this._toast = { type, message };
  }

  consumeToast(): { type: ToastType; message: string } | null {
    const toast = this._toast;
    this._toast = null; // se consume para que no se muestre de nuevo
    return toast;
  }
}
