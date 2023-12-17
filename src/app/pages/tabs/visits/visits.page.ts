import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VisitDetailsComponent } from './visit-details/visit-details.component';
import { DatabaseService } from 'src/app/API/database.service';
import { GeneralServices } from 'src/app/API/generalServices.service';
import { CreateClientsComponent } from './create-clients/create-clients.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './visits.page.html',
  styleUrls: ['./visits.page.scss'],
})
export class VisitsPage implements OnInit {
  @ViewChild('userMenu') userMenu: any;
  userName: any;

  constructor(
    private modalCtrl: ModalController,
    private databaseService: DatabaseService,
    private generalServices: GeneralServices
  ) {}

  clientDomies = [
    {
      id: 1,
      name: 'Bastian',
      lastName: 'Carrasco',
      address: 'AV PRUEBA',
      ruc: '954984',
      city: 'Santiago',
      email: 'BastianCarrasco@gmail.com',
      contactName: 'Felipe ',
      contactPhone: '654654',
      contactPhone2: '654564',
    },
    {
      id: 2,
      name: 'Matias',
      lastName: 'Perez',
      address: 'AV PRUEBA',
      ruc: '954984',
      city: 'Santiago',
      email: 'Matias@gmail.com',
      contactName: 'Felipe ',
      contactPhone: '654654',
      contactPhone2: '654564',
    },
  ];

  clients: any[] = [];

  ngOnInit() {
    const userData: any = localStorage.getItem('userData');
    const name = userData.split('@');
    this.userName = name[0];
    this.generalServices.rightMenu.subscribe(() => {
      this.closeUserMenu();
    });
    this.getClient();
  }

  async getClient() {
    const values: any = await this.databaseService.loadClients();
    this.clients = values;
  }

  openUserMenu() {
    this.userMenu.open();
  }

  closeUserMenu() {
    this.userMenu.close();
  }

  async openDetail(element: any) {
    const modal = await this.modalCtrl.create({
      component: VisitDetailsComponent,
      componentProps: {
        eventData: element,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.getClient();
    }
  }

  async openCreateClients() {
    const modal = await this.modalCtrl.create({
      component: CreateClientsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
}
