import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastType } from '@core/types/toast.types';

interface ToastConfig {
  class: string;
  icon: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly defaultDuration = 3000;
  private readonly toastController: ToastController = inject(ToastController);

  public async show(message: string, type: ToastType = 'info'): Promise<void> {
    const config = this.getToastConfig(type);

    const toast = await this.toastController.create({
      message,
      duration: config.duration,
      cssClass: config.class,
      icon: config.icon,
      position: 'bottom',
    });

    await toast.present();
  }

  private getToastConfig(type: ToastType): ToastConfig {
    const baseConfig: Record<ToastType, ToastConfig> = {
      success: {
        class: 'toast-success',
        icon: 'checkmark-circle-outline',
        duration: this.defaultDuration,
      },
      error: {
        class: 'toast-error',
        icon: 'close-circle-outline',
        duration: this.defaultDuration,
      },
      warning: {
        class: 'toast-warning',
        icon: 'alert-circle-outline',
        duration: this.defaultDuration,
      },
      info: {
        class: 'toast-error',
        icon: 'information-circle-outline',
        duration: this.defaultDuration,
      },
    };

    return baseConfig[type];
  }

  // Para llamar
  public success(message: string): Promise<void> {
    return this.show(message, 'success');
  }

  public error(message: string): Promise<void> {
    return this.show(message, 'error');
  }

  public warning(message: string): Promise<void> {
    return this.show(message, 'warning');
  }

  public info(message: string): Promise<void> {
    return this.show(message, 'info');
  }
}
