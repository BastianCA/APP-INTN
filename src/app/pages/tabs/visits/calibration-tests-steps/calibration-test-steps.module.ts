import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwiperModule } from 'swiper/angular';
import { PipesModule } from 'src/app/shared/pipes/modules/pipes.module';
import { CalibrationTestsStepsComponent } from './calibration-tests-steps.component';
import { SettingsPageModule } from 'src/app/pages/settings/settings.module';
import { CalibrationTestStepsRoutingModule } from './calibration-test-steps-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageModule,
    CalibrationTestStepsRoutingModule,
    SwiperModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  declarations: [CalibrationTestsStepsComponent],
  exports: [CalibrationTestsStepsComponent],
})
export class CalibrationTestStepsModule {}
