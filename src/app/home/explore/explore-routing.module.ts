import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplorePage } from './explore.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'receipts', pathMatch: 'full',
    component: ExplorePage
  },
  {
    path: 'receipts',
    loadChildren: () => import('./receipts/receipts.module').then( m => m.ReceiptsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorePageRoutingModule {}
