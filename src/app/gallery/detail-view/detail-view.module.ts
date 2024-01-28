import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailViewPageRoutingModule } from './detail-view-routing.module';

import { DetailViewPage } from './detail-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailViewPageRoutingModule
  ],
  declarations: [DetailViewPage]
})
export class DetailViewPageModule {}
