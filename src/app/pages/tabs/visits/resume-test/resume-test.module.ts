import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumeTestRoutingModule } from './resume-test-routing.module';
import { ResumeTestComponent } from './resume-test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsPageModule } from 'src/app/pages/settings/settings.module';
import { PipesModule } from 'src/app/shared/pipes/modules/pipes.module';
import { SwiperModule } from 'swiper/angular';
import { SignaturePageComponent } from '../signature-page/signature-page.component';
import { SignaturePadModule } from '../signature-page/signature-pad.module';

@NgModule({
  declarations: [ResumeTestComponent],
  exports: [ResumeTestComponent],
  imports: [
    CommonModule,
    ResumeTestRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageModule,
    SwiperModule,
    ReactiveFormsModule,
    PipesModule,
    SignaturePadModule
  ],
})
export class ResumeTestModule {}
