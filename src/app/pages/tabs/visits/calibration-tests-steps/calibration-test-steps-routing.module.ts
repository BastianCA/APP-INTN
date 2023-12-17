import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalibrationTestsStepsComponent } from './calibration-tests-steps.component';


const routes: Routes = [
  {
    path: '',
    component: CalibrationTestsStepsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalibrationTestStepsRoutingModule {}
