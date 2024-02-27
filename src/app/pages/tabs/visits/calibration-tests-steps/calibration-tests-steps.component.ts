import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { firstStepModel } from './data/step.fields';
import { GeneralServices } from 'src/app/API/generalServices.service';
import { DatabaseService } from 'src/app/API/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calibration-tests-steps',
  templateUrl: './calibration-tests-steps.component.html',
  styleUrls: ['./calibration-tests-steps.component.scss'],
})
export class CalibrationTestsStepsComponent implements OnInit {
  currentStep = 0;
  formGroup = new FormGroup({});
  steps: StepModel[] = firstStepModel;
  formsValues: any[] = [];
  inputPrincipalValue: any;
  disableAdd = true;
  nValue: any;
  rangos = [500, 2000];
  clientData: any;
  segmentLabelValue = 'Excentricidad';
  tabValues: any;
  testData: any[] = [];
  action: any;
  tableDesign: StepModel[] = firstStepModel;
  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private generalServices: GeneralServices,
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.tabValues = this.steps.slice(2, 5);
    this.action = this.activatedRoute.snapshot.paramMap;

    this.initForm(this.steps[this.currentStep]);
    if (this.action.params.action === 'create') {
      const datos: any = await this.databaseService.loadTests();
      this.testData[0] = datos[datos.length - 1];
    } else {
      this.getTestData(+this.action.params.test).then(() => {
        this.clientData = JSON.parse(this.testData[0].client_data);
        const datos = JSON.parse(this.testData[0].data);
        setTimeout(() => {
          this.setAllValues(datos);
        }, 1000);
      });
    }
    this.generalServices.popUpAction.subscribe((value: any) => {
      if (value === 'cancel-warning-modal') {
        this.finalStep();
      }
    });
    this.formGroup.get('divisionInput')?.valueChanges.subscribe(() => {
      this.formsValidations();
    });
    this.formGroup.get('cargaMaximaInput')?.valueChanges.subscribe(() => {
      this.formsValidations();
    });
    this.formGroup.get('cantidadPesa1000')?.valueChanges.subscribe((data) => {
      //@ts-ignore
      this.formGroup.get('totalPesa1000')?.setValue(this.cal(data, 1000));
    });
    this.formGroup.get('cantidadPesa500')?.valueChanges.subscribe((data) => {
      //@ts-ignore
      this.formGroup.get('totalPesa500')?.setValue(this.cal(data, 500));
    });
    this.formGroup.get('cantidadPesa20')?.valueChanges.subscribe((data) => {
      //@ts-ignore
      this.formGroup.get('totalPesa20')?.setValue(this.cal(data, 20));
    });
    this.formGroup.get('cantidadPesa10')?.valueChanges.subscribe((data) => {
      //@ts-ignore
      this.formGroup.get('totalPesa10')?.setValue(this.cal(data, 10));
    });
    this.formGroup.get('cantidadPesa5')?.valueChanges.subscribe((data) => {
      //@ts-ignore
      this.formGroup.get('totalPesa5')?.setValue(this.cal(data, 5));
    });
  }

  setAllValues(datos: any) {
    this.formsValues[0] = datos.instrumento;
    this.formsValues[1] = datos.preCarga;
    this.formsValues[2] = datos.influenciaPosicionCarga;
    this.formsValues[3] = datos.repetibilidad;
    this.formsValues[4] = datos.desempenoCarga;
    this.steps[1].repeatSteps = datos.preCarga;
    this.steps[2].repeatSteps = datos.influenciaPosicionCarga;
    this.steps[3].repeatSteps = datos.repetibilidad;
    this.steps[4].repeatSteps = datos.desempenoCarga;
    this.tableDesign[1].repeatSteps = datos.preCarga;
    this.tableDesign[2].repeatSteps = datos.influenciaPosicionCarga;
    this.tableDesign[3].repeatSteps = datos.repetibilidad;
    this.tableDesign[4].repeatSteps = datos.desempenoCarga;
    this.setValues(this.steps[this.currentStep]);
  }

  async getTestData(id: any) {
    const datos: any = await this.databaseService.loadTestsById(+id);
    this.testData = datos;
  }

  selectSegment(label: string, i: any) {
    if (i === 0) {
      this.currentStep = 2;
      this.initForm(this.steps[2]);
    }
    if (i === 1) {
      this.currentStep = 3;
      this.initForm(this.steps[3]);
    }
    if (i === 2) {
      this.currentStep = 4;
      this.initForm(this.steps[4]);
      this.formGroup
        .get('balanzaPesoSensible')
        //@ts-ignore
        ?.setValue(+this.formsValues[0].divisionInput * 2);
    }

    this.segmentLabelValue = label;
  }

  handleValueChange() {
    this.formsValidations();
  }

  initValuesForm(input: any) {
    input.forEach((filter: any) => {
      const paramName = filter.paramName;
      const paramName2 = filter.paramName2;
      const defaultValue = filter.defaultValue ? filter.defaultValue : '';
      const defaultValue2 = filter.defaultValue2 ? filter.defaultValue2 : '';
      const disabled = filter.disabled ? filter.disabled : false;
      const required = filter.required === true;
      const formControlOptions = {
        value: defaultValue || defaultValue2,
        disabled: disabled,
      };
      const validators = required ? [Validators.required] : [];
      if (paramName) {
        this.formGroup.addControl(
          paramName,
          new FormControl(formControlOptions, validators)
        );
      }
      if (paramName2) {
        this.formGroup.addControl(
          paramName2,
          new FormControl(formControlOptions, validators)
        );
      }
    });
    if (this.steps[this.currentStep].principalInput) {
      const valueInput: any = this.steps[this.currentStep].principalInput;
      this.formGroup.addControl(
        valueInput.paramName,
        new FormControl({
          value: valueInput?.defaultValue,
          disabled: valueInput?.disabled,
        })
      );
    }
  }

  initForm(step: any) {
    this.formGroup = new FormGroup({});
    if (this.steps[this.currentStep].principalInput) {
      this.inputPrincipalValue = '';
    }
    this.initValuesForm(step.inputs);
    if (step.inputSubtitle) {
      this.initValuesForm(step.inputSubtitle);
    }
    if (step.inputSubtitle2) {
      this.initValuesForm(step.inputSubtitle2);
    }
  }

  overWriteValues() {
    if (this.steps[this.currentStep].repeatSteps) {
      if (this.formsValues[this.currentStep] !== undefined) {
        this.formsValues[this.currentStep] = []; // Borra los valores actuales del paso actual
      }
      this.formsValues[this.currentStep] =
        this.steps[this.currentStep].repeatSteps;
    } else {
      if (
        this.formsValues.length > 0 &&
        this.formsValues[this.currentStep].instrumento !== ''
      ) {
        this.formsValues[this.currentStep] = []; // Borra los valores actuales del paso actual
      }
      this.formsValues[this.currentStep] = this.formGroup.getRawValue();
    }
  }

  filterTableDesign() {
    let originalData = [...this.tableDesign[this.currentStep].repeatSteps];

    // Separar la primera fila
    let primeraFila = originalData.shift();

    const sonIguales = (obj1: any, obj2: any) => {
      // Lógica de comparación personalizada
      // En este ejemplo, se compara cada propiedad del objeto
      const propiedadesObj1 = Object.keys(obj1);
      const propiedadesObj2 = Object.keys(obj2);

      if (propiedadesObj1.length !== propiedadesObj2.length) {
        return false;
      }

      for (const element of propiedadesObj1) {
        const propiedad = element;
        if (obj1[propiedad] !== obj2[propiedad]) {
          return false;
        }
      }

      return true;
    };

    const existePrimeraFila = originalData.some((element) =>
      sonIguales(element, primeraFila)
    );

    if (existePrimeraFila) {
      originalData.forEach((fila) => {
        fila.mep = '';
        fila.eMep = '';
        fila.errorInstrumento = '';
      });
      const arregloMapeado = [primeraFila, ...originalData];
      this.tableDesign[this.currentStep].repeatSteps = arregloMapeado;
    }
  }

  cleanAllValues() {
    this.currentStep = 0;
    this.formsValues = [];
    this.steps[1].repeatSteps = [];
    this.steps[2].repeatSteps = [];
    this.steps[3].repeatSteps = [];
    this.steps[4].repeatSteps = [];
    this.tableDesign[1].repeatSteps = [];
    this.tableDesign[2].repeatSteps = [];
    this.tableDesign[3].repeatSteps = [];
    this.tableDesign[4].repeatSteps = [];
    this.steps[1].completed = false;
    this.steps[2].completed = false;
    this.steps[3].completed = false;
    this.steps[4].completed = false;
  }

  async cancel() {
    const action: any = this.activatedRoute.snapshot.paramMap;
    this.overWriteValues();
    this.updateTestData('No Terminado');
    const toast = await this.toastController.create({
      message: 'Ensayo Guardado Correctamente.',
      duration: 1500,
      position: 'top',
      color: 'success',
      cssClass: 'custom-toast',
    });
    await toast.present();
    if (action.params.action === 'create') {
      this.navCtrl.navigateForward(['/tabs/visits']);
    } else {
      this.navCtrl.navigateForward(['/tabs/history', { update: true }]);
    }
    this.cleanAllValues();
  }

  async nextStep() {
    switch (this.currentStep) {
      case 0:
        if (this.formGroup.valid) {
          this.stepValidated();
          this.rangos = this.rangos.map(
            (x) => x * +this.formsValues[0].divisionInput
          );
        }
        break;
      case 1:
        this.stepValidated();
        break;
      case 2:
        if (this.steps[this.currentStep].repeatSteps.length > 0) {
          const mep = this.steps[this.currentStep].repeatSteps.every(
            (objeto: any) => objeto.eMep === 'OK'
          );
          if ((await this.validateStepExentricitie()) && mep) {
            this.steps[this.currentStep].completed = true;
            this.saveCurrenStep();
          } else {
            this.generalServices.presentAlert(
              'Verificación Rechazada',
              '',
              'Verifique los valores.',
              'Volver a realizar',
              'Finalizar'
            );
          }
        }
        break;
      case 3:
        const mep1 = this.steps[this.currentStep].repeatSteps.every(
          (objeto: any) => objeto.eMep === 'OK'
        );
        if ((await this.validateStepPreChargeAndRepeat()) && mep1) {
          this.saveCurrenStep();
        } else {
          this.generalServices.presentAlert(
            'Verificación Rechazada',
            '',
            'Verifique los valores.',
            'Volver a realizar',
            'Finalizar'
          );
        }
        break;
      case 4:
        const mep = this.steps[this.currentStep].repeatSteps.every(
          (objeto: any) => objeto.eMep === 'OK'
        );
        const discrimination = this.steps[this.currentStep].repeatSteps.every(
          (objeto: any) => objeto.respuesta === 'SI'
        );
        if (mep && discrimination) {
          this.formsValues.push(this.steps[this.currentStep].repeatSteps);
          this.saveCurrenStep();
        } else {
          this.generalServices.presentAlert(
            'Verificación Rechazada',
            '',
            'Verifique los valores.',
            'Volver a realizar',
            'Finalizar'
          );
        }
        break;
    }
  }

  async validateStepPreChargeAndRepeat() {
    if (
      this.steps[this.currentStep].allowedRepeats ===
      this.steps[this.currentStep].repeatSteps.length
    ) {
      return true;
    } else {
      const toast = await this.toastController.create({
        message: 'Se deben ingresar solo 3 registros',
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
      return false;
    }
  }

  async validateStepExentricitie() {
    const cantidad = this.steps[this.currentStep].repeatSteps.length;
    if (cantidad === 2 || cantidad === 4 || cantidad === 6) {
      return true;
    } else {
      const toast = await this.toastController.create({
        message: 'Se puede ingresar solo 2, 4 o 6 registros.',
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
      return false;
    }
  }

  stepValidated() {
    this.steps[this.currentStep].completed = true;
    this.overWriteValues();
    this.updateTestData('No Terminado');
    this.currentStep++;
    this.initForm(this.steps[this.currentStep]);
    this.inputPrincipalValue = '';
    this.presentToast();
  }

  async updateTestData(status: string) {
    const values = this.formsValues;
    const jsonData = {
      instrumento: values[0] ? values[0] : [],
      preCarga: values[1] ? values[1] : [],
      influenciaPosicionCarga: values[2] ? values[2] : [],
      repetibilidad: values[3] ? values[3] : [],
      desempenoCarga: values[4] ? values[4] : [],
    };
    const estados = {
      preCarga: this.steps[1].completed,
      influenciaPosicionCarga: this.steps[2].completed,
      repetibilidad: this.steps[3].completed,
      desempenoCarga: this.steps[4].completed,
    };
    await this.databaseService.editTest(
      this.testData[this.testData.length - 1].idTest,
      jsonData,
      '',
      status,
      estados,
      []
    );
  }

  saveCurrenStep() {
    this.steps[this.currentStep].completed = true;
    if (this.formsValues[this.currentStep] !== undefined) {
      this.formsValues[this.currentStep] = []; // Borra los valores actuales del paso actual
    }
    this.formsValues[this.currentStep] =
      this.steps[this.currentStep].repeatSteps;
    this.updateTestData('No Terminado');
    this.presentToast();
    this.filterTableDesign();
    setTimeout(() => {
      if (this.steps.every((element: any) => element.completed === true)) {
        this.generalServices.presentAlert(
          'Verificación Aceptada',
          '',
          '¿Desea terminar el ensayo?',
          'Cancelar',
          'Finalizar',
          'checkmark-done-outline'
        );
      }
    }, 1000);
  }

  setValues(data: any) {
    if (this.formsValues.length === 0) {
      return;
    }
    const values = this.formsValues[this.currentStep];

    if (data.inputs) {
      this.setFormValues(data.inputs, values);
    }
    if (data.inputSubtitle) {
      this.setFormValues(data.inputSubtitle, values);
    }
    if (data.inputSubtitle2) {
      this.setFormValues(data.inputSubtitle2, values);
    }
  }

  formsValidations() {
    const values = this.formGroup;
    switch (this.currentStep) {
      case 0:
        values.get('divisionInput')?.valueChanges.subscribe((value: any) => {
          //@ts-ignore
          values.get('intervaloCarga')?.setValue(value);
          //@ts-ignore
          values.get('cargaMinima')?.setValue(+value * 20);
        });
        values.get('cargaMaximaInput')?.valueChanges.subscribe((value: any) =>
          //@ts-ignore
          values.get('maxPrimerRango')?.setValue(value)
        );
        if (
          values.get('cargaMaximaInput')?.value !== '' &&
          values.get('divisionInput')?.value !== ''
        ) {
          this.nValue =
            //@ts-ignore
            values.get('cargaMaximaInput')?.value /
            //@ts-ignore
            values.get('divisionInput')?.value;
        }
        break;
      case 1:
        values.get('indicacion')?.valueChanges.subscribe((value: any) => {
          if (value !== '') {
            this.steps[this.currentStep].controlAddButton = false;
          } else {
            this.steps[this.currentStep].controlAddButton = true;
          }
        });
        break;
      case 2:
        if (this.inputPrincipalValue !== '') {
          values.get('punta1')?.enable();
          values.get('medio')?.enable();
          values.get('punta2')?.enable();
          values.get('direccion')?.enable();
          values.get('punta2')?.valueChanges.subscribe((value: any) => {
            if (value !== '' && values.get('punta1')?.value !== '') {
              this.steps[this.currentStep].controlAddButton = false;
            } else {
              this.steps[this.currentStep].controlAddButton = true;
            }
          });
        } else {
          values.get('punta1')?.disable();
          values.get('medio')?.disable();
          values.get('punta2')?.disable();
          values.get('direcion')?.disable();
        }
        break;
      case 3:
        this.casePreChargeAndRepeatStep(values);
        break;
      case 4:
        console.log('case 4');
        break;
    }
  }

  casePreChargeAndRepeatStep(values: any) {
    if (this.inputPrincipalValue !== '') {
      values.get('indicacion')?.enable();
      values.get('indicacion')?.valueChanges.subscribe((value: any) => {
        if (value !== '') {
          this.steps[this.currentStep].controlAddButton = false;
        } else {
          this.steps[this.currentStep].controlAddButton = true;
        }
      });
    } else {
      values.get('indicacion')?.disable();
    }
  }

  setFormValues(formArray: any, values: any) {
    if (values !== undefined) {
      formArray.forEach((filter: any) => {
        const paramName2 = filter.paramName2;
        const paramName = filter.paramName;
        const value2 = values[paramName2] ? values[paramName2] : '';
        const value = values[paramName] ? values[paramName] : '';
        if (paramName2) {
          this.formGroup.get(paramName2)?.setValue(value2);
        }
        this.formGroup.get(paramName)?.setValue(value);
      });
    }
    if (this.steps[this.currentStep].principalInput) {
      const name: any = this.steps[this.currentStep].principalInput?.paramName;
      const valuePrincipal = values[name] ? values[name] : '';
      this.inputPrincipalValue = valuePrincipal;
      this.formGroup.get(name)?.setValue(valuePrincipal);
    }
  }

  addStepTest() {
    if (this.formGroup.valid) {
      if (this.currentStep === 4) {
        const error =
          // @ts-ignore
          +this.formGroup.get('indicacion')?.value -
          // @ts-ignore
          +this.formGroup.get('cargaAplicada')?.value;
        //@ts-ignore
        this.formGroup.get('errorInstrumento')?.setValue(error);
        this.formGroup.get('mep')?.setValue(
          //@ts-ignore
          this.calculateMep(this.formGroup.get('cargaAplicada')?.value)
        );
        if (
          //@ts-ignore
          Math.abs(this.formGroup.get('errorInstrumento')?.value) <=
          //@ts-ignore
          this.formGroup.get('mep')?.value
        ) {
          //@ts-ignore
          this.formGroup.get('eMep')?.setValue('OK');
        } else {
          //@ts-ignore
          this.formGroup.get('eMep')?.setValue('REP');
        }
        this.steps[this.currentStep].repeatSteps.push(
          this.formGroup.getRawValue()
        );
      }
      if (this.currentStep === 1) {
        this.steps[this.currentStep].repeatSteps.push(
          this.formGroup.getRawValue()
        );
      }
      if (this.currentStep === 2) {
        console.log(
          this.formGroup.get('cargaAplicada')?.value,
          this.inputPrincipalValue
        );

        this.steps[this.currentStep].repeatSteps.push({
          cargaAplicada: this.formGroup.get('cargaAplicada')?.value,
          ...this.formGroup.getRawValue(),
        });
        this.stepChargePositionCal();
      }
      if (this.currentStep === 3) {
        this.steps[this.currentStep].repeatSteps.push({
          repetibilidadAl: this.formGroup.get('repetibilidadAl')?.value,
          ...this.formGroup.getRawValue(),
        });
        this.stepPreCargaCal();
      }
      //@ts-ignore
      this.formGroup.get('indicacion')?.setValue('');
      //@ts-ignore
      this.formGroup.get('errorInstrumento')?.setValue('');
      //@ts-ignore
      this.formGroup.get('medio')?.setValue('');
      //@ts-ignore
      this.formGroup.get('punta1')?.setValue('');
      //@ts-ignore
      this.formGroup.get('punta2')?.setValue('');
    }
  }

  stepPreCargaCal() {
    if (this.currentStep === 3) {
      this.calculateInstrumentErrorRep();
    } else {
      this.calculateInstrumentError();
    }
    this.steps[this.currentStep].repeatSteps.forEach(
      (element: any) =>
        (element.mep = this.calculateMep(this.inputPrincipalValue))
    );
    this.steps[this.currentStep].repeatSteps.forEach((element: any) => {
      if (Math.abs(element.errorInstrumento) <= element.mep) {
        element.eMep = 'OK';
      } else {
        element.eMep = 'REP';
      }
    });
  }

  stepChargePositionCal() {
    this.steps[this.currentStep].repeatSteps.forEach((element: any) => {
      let diferenciaMax: any = '';
      let diferenciaMin: any = '';
      if (element.medio !== '') {
        const valores = [+element.punta1, +element.medio, +element.punta2];
        diferenciaMax = Math.abs(
          this.inputPrincipalValue - Math.max(...valores)
        );
        diferenciaMin = Math.abs(
          this.inputPrincipalValue - Math.min(...valores)
        );
        element.errorInstrumento = Math.max(diferenciaMax, diferenciaMin);
      } else {
        const valores = [+element.punta1, +element.punta2];
        diferenciaMax = Math.abs(
          this.inputPrincipalValue - Math.max(...valores)
        );
        diferenciaMin = Math.abs(
          this.inputPrincipalValue - Math.min(...valores)
        );
        element.errorInstrumento = Math.max(diferenciaMax, diferenciaMin);
      }
    });

    this.steps[this.currentStep].repeatSteps.forEach(
      (element: any) =>
        (element.mep = this.calculateMep(this.inputPrincipalValue))
    );
    this.steps[this.currentStep].repeatSteps.forEach((element: any) => {
      if (Math.abs(element.errorInstrumento) <= element.mep) {
        element.eMep = 'OK';
      } else {
        element.eMep = 'REP';
      }
    });
  }

  calculateMep(cargaAplicada: any) {
    if (cargaAplicada >= 0 && cargaAplicada <= this.rangos[0]) {
      return +this.formsValues[0].divisionInput * 1;
    } else if (cargaAplicada <= this.rangos[1]) {
      return +this.formsValues[0].divisionInput * 2;
    } else {
      return +this.formsValues[0].divisionInput * 3;
    }
  }

  calculateInstrumentError() {
    const calc = (value: number, valuePrincipal: number) => {
      return value - valuePrincipal;
    };
    const suma = this.steps[this.currentStep].repeatSteps.reduce(function (
      acumulador: any,
      valorActual: any
    ) {
      return acumulador + +valorActual.indicacion;
    },
    0);
    const promedio = suma / this.steps[this.currentStep].repeatSteps.length;
    this.steps[this.currentStep].repeatSteps.forEach(
      (element: any) =>
        (element.errorInstrumento = calc(
          promedio,
          this.inputPrincipalValue
        ).toFixed(1))
    );
  }

  calculateInstrumentErrorRep() {
    const valores = this.steps[this.currentStep].repeatSteps.map(
      (element: any) => element.indicacion
    );
    const diferencia = Math.max(...valores) - Math.min(...valores);
    this.steps[this.currentStep].repeatSteps.forEach(
      (data: any) => (data.errorInstrumento = diferencia.toFixed(1))
    );
  }

  prevStep() {
    this.currentStep--;
    if (this.steps[this.currentStep].completed === true) {
      this.initForm(this.steps[this.currentStep]);
      this.setValues(this.steps[this.currentStep]);
    }
  }

  prevStep2() {
    this.currentStep = 1;
    this.initForm(this.steps[this.currentStep]);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Guardado Exitosamente.',
      duration: 1500,
      position: 'top',
      color: 'success',
      cssClass: 'custom-toast',
    });
    await toast.present();
  }

  async finalStep() {
    await this.presentSuccessToast().then(() => {
      this.openResumeTest();
    });
  }

  async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Ensayo Guardado Correctamente.',
      duration: 1500,
      position: 'top',
      color: 'success',
      cssClass: 'custom-toast',
    });

    await toast.present();
  }

  async openResumeTest() {
    const data = {
      action: this.action.params.action,
      test: this.testData[this.testData.length - 1].idTest,
    };
    this.navCtrl.navigateForward(['/resume-test', data]);
    this.cleanAllValues();
  }

  deleteRow(index: any) {
    this.steps[this.currentStep].repeatSteps.splice(index, 1);
    if (this.currentStep === 3) {
      this.stepPreCargaCal();
    }
    this.filterTableDesign();
  }

  cal(value: number, total: number) {
    return value * total;
  }

  backStepFicha() {
    this.currentStep = this.currentStep - 1;
  }
  nextStepFicha() {
    this.currentStep = this.currentStep + 1;
  }
}

export interface StepModel {
  title: string;
  subtitle?: string;
  subtitle2?: string;
  subtitle3?: string;
  completed: boolean;
  addSteps?: boolean;
  controlAddButton?: boolean;
  stepValidated: boolean;
  allowedRepeats?: number;
  repeatSteps?: any;
  principalInput?: {
    type: 'input' | 'select' | 'input-select';
    typeInput?: string;
    width: string;
    placeHold: string;
    paramName: string;
    placeHold2?: string;
    paramName2?: string;
    defaultValue: string;
    defaultValue2?: string;
    arrayItems?: { label: string; value: any }[];
    disabled: boolean | any;
    disabledSelect?: boolean;
    required: boolean;
    showValue?: boolean;
    multiSelect?: boolean;
  };
  inputs: {
    type: 'input' | 'select' | 'input-select';
    typeInput?: string;
    width: string;
    placeHold: string;
    paramName: string;
    placeHold2?: string;
    paramName2?: string;
    defaultValue: string;
    color?: string;
    defaultValue2?: string;
    arrayItems?: { label: string; value: any }[];
    disabled: boolean;
    disabledSelect?: boolean;
    required: boolean;
    showValue?: boolean;
    multiSelect?: boolean;
  }[];
  inputSubtitle?: {
    type: 'input' | 'select' | 'input-select';
    width: string;
    typeInput?: string;
    placeHold: string;
    paramName: string;
    placeHold2?: string;
    color?: string;
    paramName2?: string;
    defaultValue: string;
    defaultValue2?: string;
    arrayItems?: { label: string; value: any }[];
    disabled: boolean;
    disabledSelect?: boolean;
    required: boolean;
    showValue?: boolean;
    multiSelect?: boolean;
  }[];
  inputSubtitle2?: {
    type: 'input' | 'select' | 'input-select';
    width: string;
    typeInput?: string;
    placeHold: string;
    paramName: string;
    color?: string;
    placeHold2?: string;
    paramName2?: string;
    defaultValue: string;
    defaultValue2?: string;
    arrayItems?: { label: string; value: any }[];
    disabled: boolean;
    disabledSelect?: boolean;
    required: boolean;
    showValue?: boolean;
    multiSelect?: boolean;
  }[];
}
