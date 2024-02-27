import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumeInfoComponent } from './resume-info.component';

const routes: Routes = [
  {
    path: '',
    component: ResumeInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumeInfoRoutingModule {}
