import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { Briefcase, LucideAngularModule, Plane, Shirt } from 'lucide-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TabsPageRoutingModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    LucideAngularModule.pick({
      Plane,
      Shirt,
      Briefcase,
    }),
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
