import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/API/database.service';

@Component({
  selector: 'app-create-clients',
  templateUrl: './create-clients.component.html',
  styleUrls: ['./create-clients.component.scss'],
})
export class CreateClientsComponent implements OnInit {
  formgroup: FormGroup | any;
  citiesOption: any[] | undefined;
  departmentsOptions: any;
  departments: any;
  cities: any;
  constructor(
    private modalCtrl: ModalController,
    private databaseService: DatabaseService
  ) {}

  async ngOnInit() {
    this.formgroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      ruc: new FormControl('', [Validators.required]),
      city: new FormControl(''),
      department: new FormControl(''),
      email: new FormControl('', [Validators.required]),
      contactName: new FormControl('', [Validators.required]),
      contactPhone: new FormControl('', [Validators.required]),
      contactPhone2: new FormControl('', [Validators.required]),
      localCreated: new FormControl('true'),
    });
    const cities = await this.databaseService.loadCities();
    const departments = await this.databaseService.loadDepartments();
    this.cities = cities;
    this.departmentsOptions = departments;
    this.formgroup.get('department').valueChanges.subscribe((a: any) => {
      this.loadCities(a);
    });
  }

  async loadCities(idDepartment: any) {

    this.citiesOption = this.cities?.filter(
      (element: any) => +element.id_wharehouse === +idDepartment
    );
  }

  addClient() {
    this.databaseService.addClient(this.formgroup.value).then((success) => {
      this.cancel();
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(false, 'cancel');
  }
}
