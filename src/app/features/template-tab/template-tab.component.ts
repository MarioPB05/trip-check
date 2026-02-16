import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar } from '@ionic/angular/standalone';
import { LucideAngularModule, Plus, Search } from 'lucide-angular';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LocationItemsComponent } from '@shared/components/location-items/location-items.component';
import { Template } from '@core/models/template.model';
import { LoadingService } from '@core/services/loading.service';
import { TemplateService } from '@features/template-tab/services/template.service';
import { NoTemplatesAlertComponent } from '@features/template-tab/components/no-templates-alert/no-templates-alert.component';
import { RouterLink } from '@angular/router';

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
    IonSearchbar,
    RouterLink,
  ],
})
export class TemplateTabComponent implements OnInit {
  protected readonly Plus = Plus;
  protected readonly Search = Search;
  private readonly templateService = inject(TemplateService);
  private readonly loadingService = inject(LoadingService);

  templates: Template[] = [];
  filtratedTemplates: Template[] = [];
  searchTerm: string = '';

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

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.searchTerm = input?.value.trim().toLowerCase() ?? '';

    this.filtratedTemplates = this.templates.filter((template) =>
      template.name.toLowerCase().includes(this.searchTerm),
    );
  }
}
