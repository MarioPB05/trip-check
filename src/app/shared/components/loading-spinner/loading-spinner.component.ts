import { Component, Input } from '@angular/core';
import { IonBackdrop } from '@ionic/angular/standalone';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  imports: [IonBackdrop],
})
export class LoadingSpinnerComponent {
  @Input() message: string | null = 'Cargando...';
  @Input() visible: boolean | null = false;
}
