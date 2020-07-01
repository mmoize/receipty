import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TotalsDetailPageRoutingModule } from './totals-detail-routing.module';

import { TotalsDetailPage } from './totals-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TotalsDetailPageRoutingModule
  ],
  declarations: [TotalsDetailPage],
  providers: [DatePipe]
})
export class TotalsDetailPageModule {}
