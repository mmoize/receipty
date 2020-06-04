import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiptsPage } from './receipts.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ReceiptsPage
  },
  {
    path: 'receipt-details',
    loadChildren: () => import('./receipt-details/receipt-details.module').then( m => m.ReceiptDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptsPageRoutingModule {}
