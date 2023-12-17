import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeTestComponent } from './resume-test.component';

const routes: Routes = [
  {
    path: '',
    component: ResumeTestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumeTestRoutingModule {}
