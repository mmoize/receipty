import { CaptureReceiptsComponent } from './../../../shared/capture-receipts/capture-receipts.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiptsPageRoutingModule } from './receipts-routing.module';

import { ReceiptsPage } from './receipts.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    ReceiptsPageRoutingModule,
  ],
  declarations: [ReceiptsPage, CaptureReceiptsComponent],
  entryComponents: [CaptureReceiptsComponent]
})
export class ReceiptsPageModule {}
