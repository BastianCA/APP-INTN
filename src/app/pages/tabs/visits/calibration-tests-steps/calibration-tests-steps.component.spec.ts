import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalibrationTestsStepsComponent } from './calibration-tests-steps.component';

describe('CalibrationTestsStepsComponent', () => {
  let component: CalibrationTestsStepsComponent;
  let fixture: ComponentFixture<CalibrationTestsStepsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalibrationTestsStepsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalibrationTestsStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
