import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordUpdatePageRoutingModule } from './password-update-routing.module';

import { PasswordUpdatePage } from './password-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordUpdatePageRoutingModule
  ],
  declarations: [PasswordUpdatePage]
})
export class PasswordUpdatePageModule {}
