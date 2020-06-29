import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalsDetailPage } from './totals-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TotalsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalsDetailPageRoutingModule {}
