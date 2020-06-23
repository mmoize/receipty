import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,

  },
  
  {
    path: 'profilesettings',
    loadChildren: () => import('./profile-settings/profile-settings.module').then( m => m.ProfileSettingsPageModule)
   },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
