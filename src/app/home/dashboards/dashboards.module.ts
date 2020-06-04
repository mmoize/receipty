import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardsPageRoutingModule } from './dashboards-routing.module';

import { DashboardsPage } from './dashboards.page';
import { ViewimageComponent } from 'src/app/shared/viewimage/viewimage.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardsPageRoutingModule
  ],
  declarations: [DashboardsPage, ViewimageComponent],
  entryComponents: [ViewimageComponent]
})
export class DashboardsPageModule {}
