import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageModule } from '../../settings/settings.module';
import { SwiperModule } from 'swiper/angular';
import { PipesModule } from 'src/app/shared/pipes/modules/pipes.module';
import { HistoryComponent } from './history.component';
import { HistoryRoutingModule } from './history-routing.module';

@NgModule({
  imports: [
    HistoryRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageModule,
    SwiperModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  declarations: [HistoryComponent],
})
export class HistoryModule {}
