import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { DatabaseService } from 'src/app/API/database.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild('tabs', { static: false }) tabs: IonTabs | any;
  selectedTab: any;

  constructor(private dataBaseServices: DatabaseService) {}

  ngOnInit() {}

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();

    if (this.selectedTab === 'history') {
      this.dataBaseServices.updateTest.emit();
    }
  }
}
