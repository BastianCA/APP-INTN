import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { ConnectionStatus, Network } from '@capacitor/network';
import { DatabaseService } from '../API/database.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  appVersion = '1.0.3';
  disconnectSubscription: any;
  connectSubscription: any;
  networkStatus: ConnectionStatus | any;
  wifi: boolean | any;
  users: any;
  userData: any;
  constructor(
    public modalCtrl: ModalController,
    private dataBaseServices: DatabaseService,
    private navCtrl: NavController
  ) {
    this.checkInternetConnection();
  }

  async ngOnInit() {
    const userData: any = localStorage.getItem('userData');
    if (userData) {
      const name = userData.split('@');
      this.userData = name[0];
    }
    const user: any = await this.dataBaseServices.loadUsers();
    if (user && user?.length > 0) {
      this.users = user;
    }
  }

  checkInternetConnection() {
    if (Network) {
      Network.getStatus().then((status: any) => {
        this.networkStatus = status;
        this.wifi = this.networkStatus.connected;
      });
    }
    Network.addListener('networkStatusChange', (status) => {
      this.networkStatus = status;
      this.wifi = this.networkStatus.connected;
    });
  }

  async login() {
    if (this.userData && this.userData !== '') {
      this.navCtrl.navigateForward('/tabs/home');
    } else {
      const modal = await this.modalCtrl.create({
        component: LoginPage,
        animated: true,
        cssClass: 'login-modal',
        backdropDismiss: false,
        initialBreakpoint: 0.5,
      });
      return await modal.present();
    }
  }
}
