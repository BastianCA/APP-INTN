import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwiperModule } from 'swiper/angular';
import { PipesModule } from 'src/app/shared/pipes/modules/pipes.module';
import { SettingsPageModule } from 'src/app/pages/settings/settings.module';
import { ResumeInfoRoutingModule } from './resume-info-routing.module';
import { ResumeInfoComponent } from './resume-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageModule,
    ResumeInfoRoutingModule,
    SwiperModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  declarations: [ResumeInfoComponent],
  exports: [ResumeInfoComponent],
})
export class ResumeInfoModule {}
