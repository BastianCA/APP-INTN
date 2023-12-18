import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import {
  GeneralServices,
  JsonModel,
} from 'src/app/API/generalServices.service';
import { DatabaseService } from 'src/app/API/database.service';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from 'src/app/API/photo.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  @ViewChild('userMenu') userMenu: any;
  allTests: any;
  allTestsDomies = [
    {
      idTest: 1,
      client_id: 1,
      client_name: 'Felipe',
      address: 'AV PRUEBA #123',
      data: '{"instrumento": [], "preCarga": [], "influenciaPosicionCarga": [], "repetibilidad": [], "desempenoCarga": [] }',
      status: 'No Terminado',
      fecha: '2023-11-23',
      clien_data: '{}',
    },
    {
      idTest: 2,
      client_id: 2,
      client_name: 'Matias',
      address: 'AV PRUEBA #123',
      data: '{"instrumento": [], "preCarga": [], "influenciaPosicionCarga": [], "repetibilidad": [], "desempenoCarga": [] }',
      status: 'Terminado No Enviada',
      fecha: '2022-11-22',
      clien_data: '{}',
    },
  ];
  tests: any[] = [];
  segmentValue = 'todas';
  userName: any;

  constructor(
    private generalServices: GeneralServices,
    private databaseService: DatabaseService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public photoServices: PhotoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const userData: any = localStorage.getItem('userData');
    const name = userData.split('@');
    this.userName = name[0];
    this.generalServices.rightMenu.subscribe(() => {
      this.closeUserMenu();
    });
    this.databaseService.updateTest.subscribe(() => {
      this.getTests().then(() => {
        this.filterTests();
      });
    });
    this.getTests().then(() => {
      this.filterTests();
    });

    const update: any = this.activatedRoute.snapshot.paramMap;
    console.log(update);

    if (update.params.update === 'true') {
      this.getTests().then(() => {
        this.filterTests();
      });
    }
  }

  async getTests() {
    const test: any = await this.databaseService.loadTests();
    this.allTests = test;
  }

  filterTests() {
    if (this.segmentValue === 'terminadas') {
      this.tests = this.allTests.filter((x: any) => x.status === 'Terminado');
    } else if (this.segmentValue === 'no-terminadas') {
      this.tests = this.allTests.filter(
        (x: any) => x.status === 'No Terminado'
      );
    } else if (this.segmentValue === 'terminadas-enviada') {
      this.tests = this.allTests.filter(
        (x: any) => x.status === 'Terminado Enviado'
      );
    } else if (this.segmentValue === 'terminada-no-enviada') {
      this.tests = this.allTests.filter(
        (x: any) => x.status === 'Terminado No Enviado'
      );
    } else {
      this.getTests().then(() => {
        this.tests = this.allTests;
      });
    }
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
    this.filterTests();
  }

  openUserMenu() {
    this.userMenu.open();
  }

  closeUserMenu() {
    this.userMenu.close();
  }

  async openDetail(element: any) {
    const data = {
      action: 'edit',
      test: element.idTest,
    };
    this.navCtrl.navigateForward(['/calibrations-test', data]);
  }

  async openSendData(element: any) {
    const client_approve = JSON.parse(element.client_approve);
    const datosEnsayos = JSON.parse(element.data);
    datosEnsayos.idTest = element.idTest;
    const estados = JSON.parse(element.tests_status);
    const photos: any = this.photoServices.photos;

    const body: JsonModel = {
      ensayos: {
        fechaCreacion: element.fecha,
        instrumento: datosEnsayos.instrumento,
        preCarga: datosEnsayos.preCarga,
        influenciaPosicionCarga: datosEnsayos.influenciaPosicionCarga,
        repetibilidad: datosEnsayos.repetibilidad,
        desempenoCarga: datosEnsayos.desempenoCarga,
      },
      estados: estados,
      client: JSON.parse(element.client_data),
      clientApproves: client_approve,
      photos: {
        firstPhoto: '',
        secondPhoto: '',
        thirdPhoto: '',
      },
    };
    this.generalServices.sendData(body).subscribe(
      async () => {
        const toast = await this.toastController.create({
          message: 'Informe de verificación enviado correctamente.',
          duration: 1500,
          position: 'top',
          color: 'success',
          cssClass: 'custom-toast',
        });
        await toast.present();
      },
      async (err) => {
        const toast = await this.toastController.create({
          message: 'Error al intentar Enviar el informe. Intente nuevamente',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        await toast.present();
      }
    );
  }
}
