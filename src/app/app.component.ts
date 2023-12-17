import { Component } from '@angular/core';
import { DatabaseService } from './API/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private databaseServices: DatabaseService) {
    this.initDB();
  }

  async initDB() {
    await this.databaseServices.initializationDB();


  }
}
