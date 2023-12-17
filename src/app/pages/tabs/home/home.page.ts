import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Control } from 'leaflet';
import { Map } from 'leaflet';
import { GeneralServices } from 'src/app/API/generalServices.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('userMenu') userMenu: any;
  userName: any;
  public map: Map | any;
  public locateOptions: Control.LocateOptions = {
    flyTo: false,
    keepCurrentZoomLevel: true,
    locateOptions: {
      enableHighAccuracy: true,
    },
    icon: 'leaflet-control-locate-location-arrow',
    clickBehavior: {
      inView: 'stop',
      outOfView: 'setView',
      inViewNotFollowing: 'setView',
    },
  };

  constructor(private generalServices: GeneralServices) {}

  ngOnInit() {
    const userData: any = localStorage.getItem('userData');
    const name = userData.split('@');
    this.userName = name[0];
    this.generalServices.rightMenu.subscribe(() => {
      this.closeUserMenu();
    });
    this.getCurrentLocations();
    this.printCurrentPosition();
  }

  async printCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
  }

  getCurrentLocations() {
    if (!navigator.geolocation) {
      console.log('location is not supported');
      this.map = L.map('map', {
        center: [-33.45694, -70.64827],
        zoom: 18,
        renderer: L.canvas(),
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // maxZoom: 12,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);
      setTimeout(() => {
        this.map.invalidateSize();
      }, 0);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = position.coords;
        console.log(coords);

        const latLong: any = [coords.latitude, coords.longitude];
        this.map = L.map('map', {
          center: latLong,
          zoom: 18,
          renderer: L.canvas(),
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.addInitialMarker(latLong);
        setTimeout(() => {
          this.map.invalidateSize();
        }, 0);
      });
    }
  }

  addInitialMarker(location: any) {
    const homeMarker = L.marker(location);
    homeMarker.bindPopup('Estas Aqui.', {
      closeButton: true,
    });
    this.map.addLayer(homeMarker);
  }

  openUserMenu() {
    this.userMenu.open();
  }

  closeUserMenu() {
    this.userMenu.close();
  }
}
