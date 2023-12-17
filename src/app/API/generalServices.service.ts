import { EventEmitter, Injectable } from '@angular/core';
import { ErrorModalComponent } from '../shared/error-modal/error-modal.component';
import { ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs';
import { login } from '../login/login.constants';
import { SharedServiceService } from './shared-service.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralServices {
  rightMenu = new EventEmitter();
  popUpAction = new EventEmitter();

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private sharedService: SharedServiceService
  ) {}

  async presentAlert(
    title: string,
    subTitle: string,
    body: any,
    buttonSucces: string,
    buttonCancel: string,
    icon?: any
  ) {
    const data = {
      header: title,
      subHeader: subTitle,
      message: body,
      icon: icon || 'warning',
      buttonCancel: buttonCancel,
      buttonSucces: buttonSucces,
    };
    const modalLoading = await this.modalCtrl.create({
      component: ErrorModalComponent,
      componentProps: {
        eventData: data,
      },
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25],
      backdropDismiss: false,
      handle: false,
      async canDismiss(data?: any, role?: string) {
        return role !== 'gesture';
      },
    });
    localStorage.setItem('popUpWarning', 'abierto');
    await modalLoading.present();
  }

  login(body: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(login.login, body, { headers })
      .pipe(catchError(this.sharedService.handleError.bind(this)));
  }

  sendData(body: JsonModel) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(login.SEND_DATA, body, { headers })
      .pipe(catchError(this.sharedService.handleError.bind(this)));
  }

  getCities() {
    return this.http
      .get(login.GET_CITIES)
      .pipe(catchError(this.sharedService.handleError.bind(this)));
  }

  getDepartments() {
    return this.http
      .get(login.GET_WHAREHOUSES)
      .pipe(catchError(this.sharedService.handleError.bind(this)));
  }
}

export interface JsonModel {
  ensayos: {
    fechaCreacion: string;
    instrumento: {
      instrumento: string;
      fabricante: string;
      modelo: string;
      nSerie: string;
      destinado: string;
      codigoInterno: string;
      ubicado: string;
      tipoBalanza: string;
      plataforma: string;
      escala: string;
      fijacionCursor: string;
      impresora: string;
      cargaMaximaInput: string;
      cargaMaximaTipo: string;
      divisionInput: string;
      divisionTipo: string;
      cExactitud: string;
      intervaloCarga: string;
      cargaMinima: string;
      maxPrimerRango: string;
      tecnico1: string;
      ciResponsable: string;
      tecnico2: string;
      ciConductor: string;
      movil: string;
      cantidadPesa1000: string;
      totalPesa1000: string;
      cantidadPesa500: string;
      totalPesa500: string;
      cantidadPesa20: string;
      totalPesa20: string;
      cantidadPesa10: string;
      totalPesa10: string;
      cantidadPesa5: string;
      totalPesa5: string;
      visualizacionInstrumento: string;
    };
    preCarga: {
      indicacion: string;
    };
    influenciaPosicionCarga: {
      punta1: string;
      medio: string;
      punta2: string;
      errorInstrumento: 0;
      direccion: string;
      mep: 0;
      eMep: string;
    };
    repetibilidad: {};
    desempenoCarga: {};
  };
  estados: {};
  client: {
    clientData: {
      name: string;
      lastName: string;
      address: string;
      ruc: string;
      city: string;
      department: string;
      email: string;
      contactName: string;
      contactPhone: string;
      contactPhone2: string;
      id: 0;
      localCreated: string;
    };
    partner: {};
    facturationData: {};
  };
  clientApproves: {
    clientName: string;
    ciClient: string;
    check: boolean;
    obervations: string;
    firma: string;
  };
  photos: {
    firstPhoto: string;
    secondPhoto: string;
    thirdPhoto: string;
  };
}
