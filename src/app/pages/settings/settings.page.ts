import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { GeneralServices } from 'src/app/API/generalServices.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userName: any;
  constructor(
    private navCtrl: NavController,
    private generalServices: GeneralServices
  ) {
    const userData: any = localStorage.getItem('userData');
    const name = userData.split('@');
    this.userName = name[0];
  }

  ngOnInit() {}

  logAuth() {
    this.generalServices.rightMenu.emit();
    this.navCtrl.navigateForward('/welcome');
  }
}
