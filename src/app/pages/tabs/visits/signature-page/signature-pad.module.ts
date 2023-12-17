import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignaturePadRoutingModule } from './signature-pad-routing.module';
import { SignaturePageComponent } from './signature-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsPageModule } from 'src/app/pages/settings/settings.module';
import { PipesModule } from 'src/app/shared/pipes/modules/pipes.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [SignaturePageComponent],
  exports:[SignaturePageComponent],
  imports: [
    CommonModule,
    SignaturePadRoutingModule,
    FormsModule,
    IonicModule,
    SettingsPageModule,
    SwiperModule,
    ReactiveFormsModule,
    PipesModule,
  ],
})
export class SignaturePadModule {}
