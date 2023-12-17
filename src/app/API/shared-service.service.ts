import { Injectable, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorModalComponent } from '../shared/error-modal/error-modal.component';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService implements OnInit {
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.navCtrl.navigateForward('/login');
    }
  }

  async presentAlert(title: string, subTitle: string, body: any, icon?: any) {
    const data = {
      header: title,
      subHeader: subTitle,
      message: body,
      icon: icon ? icon : 'warning',
    };
    const modalLoading = await this.modalCtrl.create({
      component: ErrorModalComponent,
      componentProps: {
        eventData: data,
      },
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25],
      backdropDismiss: false,
      handle: false,
      async canDismiss(data?: any, role?: string) {
        return role !== 'gesture';
      },
    });
    localStorage.setItem('popUpWarning', 'abierto');
    await modalLoading.present();
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    let err;
    let state = '';
    let e = '';
    if (error.status === 401) {
      e = 'Datos ingresados incorrectos, intente nuevamente.';
      state = '401';
    } else if (error.status === 403) {
      e = 'Sesión expirada. ';
      state = '403';
    } else if (error.status === 402) {
      e = error.error.detail;
      state = '402';
    } else if (error.status === 504) {
      e = 'Error de servicio.';
      state = '504';
    } else if (error.status === 500) {
      e = 'Error de comunicación intente más tarde.';
      state = '500';
    } else if (error.status === 700) {
      e = 'App en mantenimiento.';
      state = '700';
    } else {
      state = '600';
      e = 'Error de sistema contacte al administrador.';
    }
    localStorage.setItem('errorData', e);
    localStorage.setItem('error', state);
    if (error.name !== 'HttpErrorResponse' && error.error !== null) {
      err = error.error.error.errorDetails[0].message.split(':')[1];
    } else {
      err = 'Tiempo de espera agotado.';
    }
    this.setError();
    return err;
  }

  setError() {
    const e = localStorage.getItem('error');
    const text: any = localStorage.getItem('errorData');
    if (!localStorage.getItem('popUpWarning')) {
      if (e !== '' && e !== null && e !== undefined) {
        switch (e) {
          case '403':
            this.presentAlert(
              text,
              '',
              'por su seguirdad se ha cerrado sesión.'
            );
            localStorage.removeItem('token');
            localStorage.removeItem('errorData');
            localStorage.removeItem('error');
            this.navCtrl.navigateForward('/login');
            break;
          case '600':
            this.presentAlert('Error', '', text);
            localStorage.removeItem('errorData');
            localStorage.removeItem('error');
            break;
          case '500':
            this.presentAlert(
              String(text),
              'Si el problema persiste no dude en contactarnos',
              ''
            );
            break;
          case '700':
            this.presentAlert(
              String(text),
              'Nuestra aplicación se encuentra actualmente en mantenimiento programado. Estamos trabajando arduamente para mejorar tu experiencia.',
              ''
            );
            localStorage.removeItem('token');
            localStorage.removeItem('errorData');
            localStorage.removeItem('error');
            this.navCtrl.navigateForward('/login');
            break;
          default:
            this.presentAlert('Error', '', text);
            localStorage.removeItem('errorData');
            localStorage.removeItem('error');
            break;
        }
      }
    }
  }
}
