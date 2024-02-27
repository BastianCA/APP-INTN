import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StepModel } from '../calibration-tests-steps/calibration-tests-steps.component';
import { firstStepModel } from '../calibration-tests-steps/data/step.fields';
import { DatabaseService } from 'src/app/API/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resume-info',
  templateUrl: './resume-info.component.html',
  styleUrls: ['./resume-info.component.scss'],
})
export class ResumeInfoComponent implements OnInit {
  formData: StepModel[] = firstStepModel;
  testData: any;
  action: any;
  constructor(
    private navCtrl: NavController,
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.action = this.activatedRoute.snapshot.paramMap;

    const datos: any = await this.databaseService.loadTestsById(
      +this.action.params.idTest
    );
    const info = JSON.parse(datos[0].data);
    this.formData[1].repeatSteps = info.preCarga;
    this.formData[2].repeatSteps = info.influenciaPosicionCarga;
    this.formData[3].repeatSteps = info.repetibilidad;
    this.formData[4].repeatSteps = info.desempenoCarga;

    if (this.formData[0].inputs) {
      this.setFormValuesInput(this.formData[0].inputs, info.instrumento);
    }
    if (this.formData[0].inputSubtitle) {
      this.setFormValuesInput2(
        this.formData[0].inputSubtitle,
        info.instrumento
      );
    }
    if (this.formData[0].inputSubtitle2) {
      this.setFormValuesInput3(
        this.formData[0].inputSubtitle2,
        info.instrumento
      );
    }
  }

  setFormValuesInput(formArray: any, values: any) {
    if (values !== undefined) {
      formArray.forEach((filter: any, i: any) => {
        const paramName2 = filter.paramName2;
        const paramName = filter.paramName;
        const value2 = values[paramName2] ? values[paramName2] : '';
        const value = values[paramName] ? values[paramName] : '';
        if (paramName2) {
          this.formData[0].inputs[i].defaultValue2 = value2;
        }
        this.formData[0].inputs[i].defaultValue = value;
      });
    }
  }

  setFormValuesInput2(formArray: any, values: any) {
    if (values !== undefined) {
      formArray.forEach((filter: any) => {
        const paramName2 = filter.paramName2;
        const paramName = filter.paramName;
        const value2 = values[paramName2] ? values[paramName2] : '';
        const value = values[paramName] ? values[paramName] : '';
        if (paramName2) {
          console.log(value2);
        }
        console.log(value);
      });
    }
  }

  setFormValuesInput3(formArray: any, values: any) {
    if (values !== undefined) {
      formArray.forEach((filter: any) => {
        const paramName2 = filter.paramName2;
        const paramName = filter.paramName;
        const value2 = values[paramName2] ? values[paramName2] : '';
        const value = values[paramName] ? values[paramName] : '';
        if (paramName2) {
          console.log(value2);
        }
        console.log(value);
      });
    }
  }

  cancel() {
    this.navCtrl.navigateForward(['/tabs/history']);
  }
}
