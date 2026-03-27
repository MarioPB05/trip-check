import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonSearchbar } from '@ionic/angular/standalone';
import { LucideAngularModule, Plus, Search } from 'lucide-angular';
import { TripButtonComponent } from '@shared/components/trip-button/trip-button.component';
import { LocationItemsComponent } from '@shared/components/location-items/location-items.component';
import { Template } from '@core/models/template.model';
import { LoadingService } from '@core/services/loading.service';
import { TemplateService } from '@features/template-tab/services/template.service';
import { NoTemplatesAlertComponent } from '@features/template-tab/components/no-templates-alert/no-templates-alert.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '@core/services/toast.service';
import { ViewWillEnter } from '@ionic/angular';
import { NavigationToastService } from '@core/services/navigationToast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
    ReactiveFormsModule,
  ],
})
export class TemplateTabComponent implements ViewWillEnter, OnInit {
  protected readonly Plus = Plus;
  protected readonly Search = Search;
  private readonly templateService = inject(TemplateService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly navigationToastService = inject(NavigationToastService);

  templates: Template[] = [];
  filtratedTemplates: Template[] = [];
  protected searchControl = new FormControl('');

  ngOnInit() {
    // Listen to search input changes with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.onSearchChange(searchTerm);
      });
  }

  ionViewWillEnter(): void {
    const toast = this.navigationToastService.consumeToast();
    if (toast) {
      this.toastService.show(toast.message, toast.type);
    }

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

  onSearchChange(searchTerm: string | null) {
    if (searchTerm === null) {
      searchTerm = '';
    }

    this.filtratedTemplates = this.templates.filter((template) =>
      template.name.toLowerCase().includes(searchTerm),
    );
  }
}
