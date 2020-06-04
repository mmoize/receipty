import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiptDetailsPageRoutingModule } from './receipt-details-routing.module';

import { ReceiptDetailsPage } from './receipt-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptDetailsPageRoutingModule
  ],
  declarations: [ReceiptDetailsPage]
})
export class ReceiptDetailsPageModule {}
