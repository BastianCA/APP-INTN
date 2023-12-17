import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitsPageRoutingModule } from './visits-routing.module';

import { VisitsPage } from './visits.page';
import { SettingsPageModule } from '../../settings/settings.module';
import { SwiperModule } from 'swiper/angular';
import { PipesModule } from 'src/app/shared/pipes/modules/pipes.module';
import { VisitDetailsComponent } from './visit-details/visit-details.component';
import { CreateClientsComponent } from './create-clients/create-clients.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitsPageRoutingModule,
    SettingsPageModule,
    SwiperModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  declarations: [VisitsPage, VisitDetailsComponent, CreateClientsComponent],
})
export class VisitsPageModule {}
