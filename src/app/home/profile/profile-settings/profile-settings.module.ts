import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileSettingsPageRoutingModule } from './profile-settings-routing.module';

import { ProfileSettingsPage } from './profile-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileSettingsPageRoutingModule
  ],
  declarations: [ProfileSettingsPage]
})
export class ProfileSettingsPageModule {}
