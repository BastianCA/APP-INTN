import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImposibilityPageComponent } from './imposibility-page.component';

const routes: Routes = [
  {
    path: '',
    component: ImposibilityPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImposibilityPageRoutingModule {}
