import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GeneralServices } from 'src/app/API/generalServices.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
})
export class ErrorModalComponent implements OnInit {
  errorData: any;
  iconName: any;
  icon: boolean = false;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private generalServices: GeneralServices
  ) {
    this.errorData = this.navParams.get('eventData');
    console.log(this.errorData);

    if (this.errorData.icon === 'warning') {
      this.icon = false;
    } else {
      this.icon = true;
    }
  }

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss(false, 'cancel-warning-modal');
    this.generalServices.popUpAction.emit('cancel-warning-modal');
  }

  closeSucces() {
    this.modalCtrl.dismiss(true, 'confirm-warning-modal');
    this.generalServices.popUpAction.emit('confirm-warning-modal');
  }
}
