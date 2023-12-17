import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { RouteDetailComponent } from './route-detail/route-detail.component';
import { GeneralServices } from 'src/app/API/generalServices.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
  @ViewChild('userMenu') userMenu: any;
  allTransactions: any[] = [];
  transactions: any[] = [];
  segmentValue = 'todas';
  userName: any;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private generalServices: GeneralServices
  ) {}

  ngOnInit() {
    const userData: any = localStorage.getItem('userData');
    const name = userData.split('@');
    this.userName = name[0];
    this.generalServices.rightMenu.subscribe(() => {
      this.closeUserMenu();
    });
    this.allTransactions = [
      {
        id: 1,
        nombre: 'Piyush Ag.',
        fecha: '2022-05-22',
        direccion: 'AV. PRUEBA #123123',
        estado: 'PENDIENTE',
      },
      {
        id: 2,
        nombre: 'Avinash',
        fecha: '2022-03-02',
        direccion: 'AV. PRUEBA #123',
        estado: 'COMPLETADA',
      },
      {
        id: 3,
        nombre: 'Catherine',
        fecha: '2022-07-28',
        direccion: 'AV. PRUEBA #234',
        estado: 'PENDIENTE',
      },
      {
        id: 4,
        nombre: 'Akhil Ag.',
        fecha: '2022-01-09',
        direccion: 'AV. PRUEBA #1245453123',
        estado: 'PENDIENTE',
      },
      {
        id: 5,
        nombre: 'Prem Ag.',
        fecha: '2022-04-13',
        direccion: 'AV. PRUEBA #32',
        estado: 'COMPLETADA',
      },
    ];
    this.filterTransactions();
  }

  filterTransactions() {
    if (this.segmentValue === 'pendientes') {
      this.transactions = this.allTransactions.filter(
        (x) => x.estado === 'PENDIENTE'
      );
    } else if (this.segmentValue === 'completas') {
      this.transactions = this.allTransactions.filter(
        (x) => x.estado === 'COMPLETADA'
      );
    } else {
      this.transactions = this.allTransactions;
    }
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
    this.filterTransactions();
  }

  openUserMenu() {
    this.userMenu.open();
  }

  closeUserMenu() {
    this.userMenu.close();
  }

  async deleteAll() {
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'customActionSheet',
      header: '¿Estas Seguro de eliminar TODAS las rutas?',
      buttons: [
        {
          text: 'Si',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();
    if (role === 'confirm') {
      this.transactions = [];
    }
    return role === 'confirm';
  }

  async openDetail(element: any) {
    const modal = await this.modalCtrl.create({
      component: RouteDetailComponent,
      componentProps: element,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
}
