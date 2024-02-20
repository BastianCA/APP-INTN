import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/API/database.service';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.scss'],
})
export class VisitDetailsComponent implements OnInit {
  clientData: any;
  formgroup: any;
  formgroup2: any;
  formgroup3: any;
  citiesOption: any[] | undefined;
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private databaseService: DatabaseService,
    private navCtrl: NavController
  ) {
    this.getCities();
  }

  ngOnInit() {
    this.clientData = this.navParams.get('eventData');
    this.formgroup = new FormGroup({
      name: new FormControl(this.clientData.name, Validators.required),
      lastName: new FormControl(this.clientData.lastName),
      address: new FormControl(this.clientData.address, Validators.required),
      ruc: new FormControl(this.clientData.ruc, Validators.required),
      city: new FormControl(this.clientData.city, Validators.required),
      email: new FormControl(this.clientData.email, Validators.required),
      contactName: new FormControl(
        this.clientData.contactName,
        Validators.required
      ),
      contactPhone: new FormControl(
        this.clientData.contactPhone,
        Validators.required
      ),
      contactPhone2: new FormControl(
        this.clientData.contactPhone2,
        Validators.required
      ),
      id: new FormControl(this.clientData.id),
    });
    this.formgroup3 = new FormGroup({
      name: new FormControl(this.clientData.name, Validators.required),
      lastName: new FormControl(this.clientData.lastName),
      address: new FormControl(this.clientData.address, Validators.required),
      ruc: new FormControl(this.clientData.ruc, Validators.required),
      city: new FormControl(this.clientData.city, Validators.required),
      email: new FormControl(this.clientData.email, Validators.required),
      contactName: new FormControl(
        this.clientData.contactName,
        Validators.required
      ),
      contactPhone: new FormControl(
        this.clientData.contactPhone,
        Validators.required
      ),
      contactPhone2: new FormControl(
        this.clientData.contactPhone2,
        Validators.required
      ),
    });

    this.formgroup2 = new FormGroup({
      name: new FormControl('', Validators.required),
      ci: new FormControl('', Validators.required),
      cargo: new FormControl('', Validators.required),
    });

    this.formgroup.get('city').setValue(+this.clientData.city)
    this.formgroup3.get('city').setValue(+this.clientData.city)
  }
  cancel() {
    return this.modalCtrl.dismiss(false, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(true, 'confirm');
  }

  async openDetail() {
    const body = {
      name: this.formgroup.value.name,
      lastName: this.formgroup.value.lastName,
      address: this.formgroup.value.address,
      ruc: String(this.formgroup.value.ruc),
      city: this.formgroup.value.city,
      email: this.formgroup.value.email,
      contactName: this.formgroup.value.contactName,
      contactPhone: this.formgroup.value.contactPhone,
      contactPhone2: this.formgroup.value.contactPhone2,
      id: this.formgroup.value.id,
    };
    await this.databaseService.updateClient(body);
    const clientData = {
      clientData: this.formgroup.value,
      partner: this.formgroup2.value,
      facturationData: this.formgroup3.value,
    };
    const data = { action: 'create' };
    this.navCtrl.navigateForward(['/calibrations-test', data]);
    const testData = {
      clientId: this.formgroup.value.id,
      jsonData: {
        instrumento: [],
        preCarga: [],
        influenciaPosicionCarga: [],
        repetibilidad: [],
        desempenoCarga: [],
      },
      status: 'No Terminado',
      clientData: clientData,
      photos: [],
    };
    this.databaseService.addTest(testData);
    this.confirm();
  }

  async getCities() {
    const cities = await this.databaseService.loadCities();
    this.citiesOption = cities;
  }
}
