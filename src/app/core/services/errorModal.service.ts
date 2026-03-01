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

    this.activeModal = await this.modalController.create({
      component: ErrorModalComponent,
      componentProps: {
        errorData: error,
      },
      backdropDismiss: true,
      cssClass:
        'error-modal ' + (error.gravity === 'high' ? 'error-modal-high' : 'error-modal-low'),
    });

    await this.activeModal.present();

    // Limpieza automática al cerrar
    await this.activeModal.onDidDismiss();
    this.activeModal = undefined;
  }

  async dismiss(): Promise<void> {
    if (this.activeModal) {
      await this.activeModal.dismiss();
      this.activeModal = undefined;
    }
  }
}
