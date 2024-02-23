import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'calibrations-test',
    loadChildren: () =>
      import(
        './pages/tabs/visits/calibration-tests-steps/calibration-test-steps.module'
      ).then((m) => m.CalibrationTestStepsModule),
  },
  {
    path: 'resume-test',
    loadChildren: () =>
      import('./pages/tabs/visits/resume-test/resume-test.module').then(
        (m) => m.ResumeTestModule
      ),
  },
  {
    path: 'signature-page',
    loadChildren: () =>
      import('./pages/tabs/visits/signature-page/signature-pad.module').then(
        (m) => m.SignaturePadModule
      ),
  },
  {
    path: 'imposibility-page',
    loadChildren: () =>
      import('./pages/tabs/visits/imposibility-page/imposibility.module').then(
        (m) => m.CalibrationTestStepsModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
