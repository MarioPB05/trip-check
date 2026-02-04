import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { LucideAngularModule, Plus, Search } from 'lucide-angular';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LocationItemsComponent } from '@shared/components/location-items/location-items.component';
import { Template } from '@core/models/template.model';
import { LoadingService } from '@core/services/loading.service';
import { TemplateService } from '@features/template-tab/services/template.service';
import { NoTemplatesAlertComponent } from '@features/template-tab/components/no-templates-alert/no-templates-alert.component';

@Component({
  selector: 'app-template-tab',
  templateUrl: './template-tab.component.html',
  styleUrls: ['./template-tab.component.scss'],
  imports: [
    IonContent,
    LucideAngularModule,
    TripButtonComponent,
    LocationItemsComponent,
    NoTemplatesAlertComponent,
  ],
})
export class TemplateTabComponent implements AfterViewInit, OnInit {
  protected readonly Plus = Plus;
  protected readonly Search = Search;
  private readonly templateService = inject(TemplateService);
  private readonly loadingService = inject(LoadingService);

  templates: Template[] = [];
  filtratedTemplates: Template[] = [];
  searchTerm: string = '';

  constructor() {}

  @ViewChild('searchIcon', { read: ElementRef })
  searchIconRef!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    try {
      this.loadingService.show('Cargando plantillas...');
      this.templateService.getAllTemplates().then((templates) => {
        this.templates = templates;
        this.filtratedTemplates = templates;
        this.loadingService.hide();
      });
    } catch (error) {
      this.loadingService.hide();
      console.error('Error loading templates');
    }
  }

  ngAfterViewInit(): void {
    // Make search icon absolute
    const svg = this.searchIconRef.nativeElement.querySelector('svg');
    if (!svg) return;

    svg.style = `
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ion-color-medium);
    `;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.searchTerm = input?.value.trim().toLowerCase() ?? '';

    this.filtratedTemplates = this.templates.filter((template) =>
      template.name.toLowerCase().includes(this.searchTerm),
    );
  }
}
