import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditaccountPageRoutingModule } from './editaccount-routing.module';
import { ComponentsModule } from '../../components/components.module';

import { EditaccountPage } from './editaccount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    EditaccountPageRoutingModule
  ],
  declarations: [EditaccountPage]
})
export class EditaccountPageModule {}
