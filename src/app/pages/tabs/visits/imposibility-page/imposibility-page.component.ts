import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-imposibility-page',
  templateUrl: './imposibility-page.component.html',
  styleUrls: ['./imposibility-page.component.scss'],
})
export class ImposibilityPageComponent implements OnInit {
  formgroup: any;
  dropDownOptions = [
    { id: '1', name: 'Motivo 1' },
    { id: '2', name: 'Motivo 2' },
    { id: '3', name: 'Motivo 3' },
    { id: '4', name: 'Motivo 4' },
  ];
  constructor(  private navCtrl: NavController,) {}

  ngOnInit() {
    this.formgroup = new FormGroup({
      motivo: new FormControl(''),
      tecnico: new FormControl(''),
      chofer: new FormControl(''),
      firma: new FormControl(''),
      comentario: new FormControl(''),
    });
  }

  cancel() {
    this.navCtrl.navigateForward(['/tabs/visits']);
  }
}
