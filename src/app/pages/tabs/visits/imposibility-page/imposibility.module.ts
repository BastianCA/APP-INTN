import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwiperModule } from 'swiper/angular';
import { PipesModule } from 'src/app/shared/pipes/modules/pipes.module';
import { SettingsPageModule } from 'src/app/pages/settings/settings.module';
import { ImposibilityPageComponent } from './imposibility-page.component';
import { ImposibilityPageRoutingModule } from './imposibility-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageModule,
    ImposibilityPageRoutingModule,
    SwiperModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  declarations: [ImposibilityPageComponent],
  exports: [ImposibilityPageComponent],
})
export class CalibrationTestStepsModule {}
