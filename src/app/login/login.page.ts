import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { GeneralServices } from '../API/generalServices.service';
import { Network } from '@capacitor/network';
import { DatabaseService } from '../API/database.service';
import { forkJoin, from, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userName: string | any;
  password: string | any;
  users: any[] = [];
  cities: any[] = [];
  departments: any[] = [];
  constructor(
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    private generalServices: GeneralServices,
    private databaseService: DatabaseService,
    private toastController: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    const users: any = await this.databaseService.loadUsers();
    this.users = users;
  }

  goToHome() {
    localStorage.setItem('userData', 'UsuarioPrueba');
    this.navCtrl.navigateForward('/tabs/home');
    this.dismiss();
  }

  async checkInternetConnection() {
    if (Network) {
      Network.getStatus().then(async (status: any) => {
        if (status.connected) {
          await this.login(status.connected);
          this.getCitiesAndDepartmens();
        } else {
          await this.checkOfflineUser();
        }
      });
    }
  }

  async getCitiesAndDepartmens() {
    const cities: any = await this.databaseService.loadCities();
    const departments: any = await this.databaseService.loadDepartments();
    if (cities?.length === 0 && departments?.length === 0) {
      this.checkCitiesAndDepartments();
    } else {
      this.cities = cities;
      this.departments = departments;
    }
  }

  checkCitiesAndDepartments() {
    this.generalServices
      .getDepartments()
      .pipe(
        switchMap((departmentsData: any) => {
          // Mapea los departamentos a un array de promesas
          const departmentPromises = departmentsData.departments.map(
            async (department: any) => {
              const body = {
                id: department.id,
                name: department.name,
              };
              // Espera a que se complete la inserción del departamento antes de continuar
              await this.databaseService.addApartments(body);
              return department.id; // Devuelve el id del departamento
            }
          );

          // Convierte las promesas en un observable
          return from(Promise.all(departmentPromises));
        })
      )
      .subscribe(
        (departmentIds: string[]) => {
          // Ahora, departmentIds contiene los IDs de los departamentos recién insertados
          console.log('Departments inserted:', departmentIds);

          // Ahora, puedes realizar la solicitud de ciudades después de las inserciones de departamentos
          this.generalServices.getCities().subscribe(
            (citiesData: any) => {
              citiesData.cities.forEach(async (city: any) => {
                const body = {
                  id: city.id_ciudad,
                  name: city.name,
                  id_wharehouse: city.departamento_id,
                };
                await this.databaseService.addCities(body);
              });
              console.log('Cities inserted successfully.');
            },
            (citiesError) => {
              console.error('Error fetching cities:', citiesError);
            }
          );
        },
        (departmentsError) => {
          console.error('Error inserting departments:', departmentsError);
        }
      );
  }

  async checkOfflineUser() {
    const userExist = this.users.find(
      (element: any) => element.password === this.password
    );

    if (userExist) {
      this.navCtrl.navigateForward('/tabs/home');
      this.dismiss();
    } else {
      const toast = await this.toastController.create({
        message: 'Usuario no existe.',
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
    }
  }

  async login(connected: boolean) {
    const body = {
      username: this.userName,
      password: this.password,
    };

    const userExist = this.users.find(
      (element: any) => element.password === this.password
    );

    if (connected && !userExist) {
      // Usuario conectado pero no existe en la base de datos
      this.generalServices.login(body).subscribe(
        async (data: any) => {
          const logAuth = {
            username: this.userName,
            password: this.password,
            idBase: data.id,
            partnerId: data.partner_id,
          };
          localStorage.setItem('userData', logAuth.username);
          await this.databaseService.addUser(logAuth);
          this.navCtrl.navigateForward('/tabs/home');
          this.dismiss();
        },
        async () => {
          const toast2 = await this.toastController.create({
            message: 'Error al intentar ingresar.',
            duration: 1500,
            position: 'top',
            color: 'danger',
          });
          await toast2.present();
        }
      );
    } else if (connected && userExist) {
      // Usuario conectado y existe en la base de datos
      this.navigateToHome();
    } else if (!connected && userExist) {
      // Usuario desconectado pero existe en la base de datos
      this.navigateToHome();
    } else {
      // Usuario desconectado y no existe en la base de datos
      const toast = await this.toastController.create({
        message: 'Usuario no existe.',
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
    }
  }

  navigateToHome() {
    this.navCtrl.navigateForward('/tabs/home');
    this.dismiss();
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
