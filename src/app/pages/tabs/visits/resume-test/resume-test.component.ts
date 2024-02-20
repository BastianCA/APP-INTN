import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/API/database.service';
import {
  GeneralServices,
  JsonModel,
} from 'src/app/API/generalServices.service';
import { PhotoService, UserPhoto } from 'src/app/API/photo.service';

@Component({
  selector: 'app-resume-test',
  templateUrl: './resume-test.component.html',
  styleUrls: ['./resume-test.component.scss'],
})
export class ResumeTestComponent implements OnInit {
  datosEnsayos: any;
  fecha = moment().format('DD/MM/yyyy');
  estados = {
    preCarga: true,
    influenciaPosicionCarga: true,
    repetibilidad: true,
    desempenoCarga: true,
  };
  resumeStatus = false;
  marcaVerificacion: any;
  estadoEnsayos = {
    preCarga: '',
    influenciaPosicionCarga: '',
    repetibilidad: '',
    desempenoCarga: '',
  };
  textAreaValue: any;
  sendButton = true;
  clientData: any;
  personaAprueba: any;
  ciAprueba: any;
  action: any;
  canWritte = false;
  allData: any;
  base64Data: any;
  photos: UserPhoto[] = [];
  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private dataBaseServices: DatabaseService,
    private activatedRoute: ActivatedRoute,
    public photoServices: PhotoService,
    public generalServices: GeneralServices
  ) { }

  async ngOnInit() {
    const testData: any = this.activatedRoute.snapshot.paramMap;

    this.action = testData.params.action;
    await this.dataBaseServices.loadTestsById(testData.params.test).then(async (datos: any) => {

      this.allData = datos[0];

      const client = JSON.parse(datos[0].client_data);
      console.log(client);
      
      this.ciAprueba = client.partner.ci
      this.personaAprueba = client.partner.name
      this.clientData = client.clientData;
      this.datosEnsayos = JSON.parse(datos[0].data);
      this.datosEnsayos.idTest = datos[0].idTest;
      this.estados = JSON.parse(datos[0].tests_status);

      this.estadosEnsayos(this.datosEnsayos, this.estados);


    });
    if (this.textAreaValue !== '') {
      this.sendButton = true;
    }
  }

  addPhotoToGallery() {
    this.photoServices
      .addNewToGallery()
      .then(() => {
        const newPhoto = this.photoServices.photos[0];
        if (newPhoto) {
          this.photos.unshift(newPhoto);
          this.photos = this.photos.slice(0, 3);
        }
      })
      .catch((error) => {
        console.error('Error al agregar nueva foto:', error);
      });
  }

  handleCheckBox(value: any) {
    this.sendButton = !value.detail.checked;
  }

  handleTextAreaValue() {
    this.sendButton = false;
  }

  estadosEnsayos(ensayos: any, estados: any) {

    this.estadoEnsayos.preCarga = this.obtenerResultado(ensayos.preCarga, estados.preCarga);
    this.estadoEnsayos.influenciaPosicionCarga = this.obtenerResultado(ensayos.influenciaPosicionCarga, estados.influenciaPosicionCarga);
    this.estadoEnsayos.repetibilidad = this.obtenerResultado(ensayos.repetibilidad, estados.repetibilidad);
    this.estadoEnsayos.desempenoCarga = this.obtenerResultado(ensayos.desempenoCarga, estados.desempenoCarga);


    this.resumeStatus =
      this.estados.preCarga =
      this.estados.influenciaPosicionCarga =
      this.estados.repetibilidad =
      this.estados.desempenoCarga;
    console.log(this.estadoEnsayos);
  }

  obtenerResultado(condicion: any[], estado: boolean): string {
    return condicion.length > 0 ? (estado ? 'Aprobado' : 'Rechazado') : 'No Realizado';
  }

  async sendData() {
    const toast = await this.toastController.create({
      message: 'Informe de verificación enviado correctamente.',
      duration: 1500,
      position: 'top',
      color: 'success',
      cssClass: 'custom-toast',
    });
    await toast.present();
    // const photos: any = this.photoServices.photos;
    // const photoBase64Array = photos.slice(0, 3).map(async (element: any) => {
    //   return await this.photoServices.readAsBase64(element);
    // });
    // console.log(photoBase64Array);

    const body: JsonModel = {
      ensayos: {
        fechaCreacion: this.allData.fecha,
        instrumento: this.datosEnsayos.instrumento,
        preCarga: this.datosEnsayos.preCarga,
        influenciaPosicionCarga: this.datosEnsayos.influenciaPosicionCarga,
        repetibilidad: this.datosEnsayos.repetibilidad,
        desempenoCarga: this.datosEnsayos.desempenoCarga,
      },
      estados: this.estados,
      client: JSON.parse(this.allData.client_data),
      clientApproves: {
        check: !this.sendButton,
        ciClient: this.ciAprueba,
        clientName: this.personaAprueba,
        firma: this.base64Data,
        obervations: this.textAreaValue,
      },
      photos: {
        firstPhoto: '',
        secondPhoto: '',
        thirdPhoto: '',
      },
    };
    this.generalServices.sendData(body).subscribe(
      (data) => {
        this.dataBaseServices.editTest(
          this.datosEnsayos.idTest,
          this.datosEnsayos,
          body.clientApproves,
          'Terminado Enviado',
          this.estados,
          body.photos
        );
        if (this.action === 'create') {
          this.navCtrl.navigateForward(['/tabs/visits']);
        } else {
          this.navCtrl.navigateForward(['/tabs/history', { update: true }]);
        }
      },
      (error) => {
        this.dataBaseServices.editTest(
          this.datosEnsayos.idTest,
          this.datosEnsayos,
          body.clientApproves,
          'Terminado No Enviado',
          this.estados,
          body.photos
        );
        if (this.action === 'create') {
          this.navCtrl.navigateForward(['/tabs/visits']);
        } else {
          this.navCtrl.navigateForward(['/tabs/history', { update: true }]);
        }
      }
    );

  }

  handleBase64(event: any) {
    this.base64Data = event;
    this.canWritte = false;
  }

  createSignature() {
    this.canWritte = true;
  }

  cancel() {
    if (this.action === 'create') {
      this.navCtrl.navigateForward(['/tabs/visits']);
    } else {
      this.navCtrl.navigateForward(['/tabs/history', { update: true }]);
    }
    this.photos = [];
  }
}
