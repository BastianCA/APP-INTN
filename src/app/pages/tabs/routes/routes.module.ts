import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RoutesComponent } from './routes.component';
import { RoutesPageRoutingModule } from './routes-routing.module';
import { SettingsPageModule } from '../../settings/settings.module';
import { RouteDetailComponent } from './route-detail/route-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutesPageRoutingModule,
    SettingsPageModule,
  ],
  declarations: [RoutesComponent, RouteDetailComponent],
})
export class RoutesModule {}
