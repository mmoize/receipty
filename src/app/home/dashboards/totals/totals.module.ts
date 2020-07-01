import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TotalsPageRoutingModule } from './totals-routing.module';

import { TotalsPage } from './totals.page';
import { DashboardsPage } from '../dashboards.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TotalsPageRoutingModule,

  ],
  declarations: [TotalsPage, DashboardsPage]
})
export class TotalsPageModule {}
