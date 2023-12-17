import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignaturePageComponent } from './signature-page.component';

const routes: Routes = [
  {
    path: '',
    component: SignaturePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignaturePadRoutingModule {}
