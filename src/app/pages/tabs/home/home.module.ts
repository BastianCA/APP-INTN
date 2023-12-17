import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SwiperModule } from 'swiper/angular';
import { SettingsPageModule } from '../../settings/settings.module';
import { NgxLeafletLocateModule } from '@runette/ngx-leaflet-locate';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SwiperModule,
    SettingsPageModule,
    NgxLeafletLocateModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
