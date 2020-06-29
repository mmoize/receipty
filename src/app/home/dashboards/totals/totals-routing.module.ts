import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalsPage } from './totals.page';

const routes: Routes = [
  {
    path: '',
    component: TotalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalsPageRoutingModule {}
