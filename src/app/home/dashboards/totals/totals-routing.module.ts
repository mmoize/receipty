import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalsPage } from './totals.page';

const routes: Routes = [
  {
    path: '',
    component: TotalsPage
  },
  {
    path: 'totals-detail',
    loadChildren: () => import('./totals-detail/totals-detail.module').then( m => m.TotalsDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalsPageRoutingModule {}
