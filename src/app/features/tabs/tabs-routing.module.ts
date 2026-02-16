import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'items',
        loadComponent: () =>
          import('@features/item-tab/item-tab.component').then((m) => m.ItemTabComponent),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('@features/home-tab/home-tab.component').then((m) => m.HomeTabComponent),
      },
      {
        path: 'templates',

        children: [
          {
            path: 'create',
            loadComponent: () =>
              import('@features/manage-template/manage-template.component').then(
                (m) => m.ManageTemplateComponent,
              ),
          },
          {
            path: '',
            loadComponent: () =>
              import('@features/template-tab/template-tab.component').then(
                (m) => m.TemplateTabComponent,
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
