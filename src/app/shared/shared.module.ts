import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CaptureReceiptsComponent } from './capture-receipts/capture-receipts.component';
import { CaptureModalComponent } from './capture-modal/capture-modal.component';


@NgModule ({
    declarations: [ CaptureModalComponent],
    imports: [CommonModule, IonicModule],
    exports: [ CaptureModalComponent],
    entryComponents: [CaptureModalComponent]
})

export class SharedModule {}
