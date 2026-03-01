import { inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorModalComponent } from '@shared/components/error-modal/error-modal.component';
import { ErrorInterface } from '@core/interfaces/error.interface';

@Injectable({
  providedIn: 'root',
})
export class ErrorModalService {
  private activeModal?: HTMLIonModalElement;
  private readonly modalController = inject(ModalController);

  async show(error: ErrorInterface): Promise<void> {
    // Evita múltiples modales apilados
    if (this.activeModal) {
      await this.activeModal.dismiss();
    }

    const modal = await this.modalController.create({
      component: ErrorModalComponent,
      componentProps: {
        errorData: error,
      },
      backdropDismiss: true,
      cssClass:
        'error-modal ' + (error.gravity === 'high' ? 'error-modal-high' : 'error-modal-low'),
    });

    this.activeModal = modal;
    await modal.present();

    // Limpieza automática al cerrar (sin bloquear al llamador)
    modal.onDidDismiss().then(() => {
      if (this.activeModal === modal) {
        this.activeModal = undefined;
      }
    });
  }

  async dismiss(): Promise<void> {
    if (this.activeModal) {
      await this.activeModal.dismiss();
      this.activeModal = undefined;
    }
  }
}
