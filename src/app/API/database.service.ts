import { EventEmitter, Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

const DB_APP = 'intndb';

export interface Client {
  id: number;
  name: string;
  lastName: string;
  address: string;
  ruc: string;
  city: string;
  department: string;
  email: string;
  contactName: string;
  contactPhone: string;
  contactPhone2: string;
  localCreated: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  updateTest = new EventEmitter();

  async initializationDB() {
    this.db = await this.sqlite.createConnection(
      DB_APP,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();
    const schema = `CREATE TABLE IF NOT EXISTS client (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      lastName TEXT NOT NULL,
      address TEXT,
      ruc INTEGER,
      city TEXT,
      department TEXT,
      email TEXT,
      contactName TEXT ,
      contactPhone TEXT ,
      contactPhone2 TEXT,
      local_created TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      id_db TEXT,
      partner_id TEXT
    );

    CREATE TABLE IF NOT EXISTS wharehouses (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      id_wharehouse TEXT,
      FOREIGN KEY (id_wharehouse) REFERENCES wharehouses(id)
    );

    CREATE TABLE IF NOT EXISTS test (
      idTest INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      data TEXT,
      client_data TEXT,
      client_approve TEXT,
      status TEXT,
      tests_status TEXT,
      fecha TEXT DEFAULT (strftime('%Y-%m-%d', 'now')),
      photos TEXT,
      FOREIGN KEY (client_id) REFERENCES client(id)
    )`;
    await this.db.execute(schema);
    return true;
  }

  async loadClients() {
    const clients = await this.db.query('SELECT * FROM client;');
    return clients.values;
  }

  async loadTests() {
    const tests = await this.db.query(
      'SELECT test.*, client.name AS client_name, client.address FROM test JOIN client ON test.client_id = client.id;'
    );
    return tests.values;
  }

  async loadTestsById(id: any) {
    const tests = await this.db.query('SELECT * FROM test WHERE idTest = ?;', [id]);
    return tests.values;
  }

  async loadDepartmentsbyCitie() {
    const tests = await this.db.query(
      'SELECT wharehouses.name AS wharehouse, cities.name AS city FROM wharehouses JOIN cities ON wharehouses.id = cities.id_wharehouse'
    );
    return tests.values;
  }

  async loadDepartments() {
    const tests = await this.db.query('SELECT * FROM wharehouses');
    return tests.values;
  }

  async loadCities() {
    const tests = await this.db.query('SELECT * FROM cities;');
    return tests.values;
  }

  async loadUsers() {
    const tests = await this.db.query('SELECT * FROM users;');
    return tests.values;
  }

  async addTest(testData: any) {
    const insertQuery =
      'INSERT INTO test (client_id, data, client_data, client_approve, photos , status, tests_status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [
      testData.clientId,
      JSON.stringify(testData.jsonData),
      JSON.stringify(testData.clientData),
      JSON.stringify(testData.clientApproves),
      JSON.stringify(testData.photos),
      testData.status,
      JSON.stringify(testData.testStatus),
    ];
    const results = await this.db.query(insertQuery, values);
    return results;
  }

  async editTest(
    testId: any,
    jsonData: any,
    clientApproves: any,
    status: any,
    testStatus: any,
    photos: any
  ) {
    const updateQuery =
      'UPDATE test SET data = ?, client_approve = ?, status = ?, photos = ?, tests_status = ? WHERE idTest = ?';
    const values = [
      JSON.stringify(jsonData),
      JSON.stringify(clientApproves),
      status,
      JSON.stringify(photos),
      JSON.stringify(testStatus),
      testId,
    ];
    const results = await this.db.query(updateQuery, values);
    return results;
  }

  async addClient(clientData: Client) {
    const insertQuery =
      'INSERT INTO client (name, lastName, address, ruc, city, department, email, contactName, contactPhone, contactPhone2, local_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values: any = [
      clientData.name,
      clientData.lastName,
      clientData.address,
      String(clientData.ruc),
      clientData.city,
      clientData.department,
      clientData.email,
      clientData.contactName,
      clientData.contactPhone,
      clientData.contactPhone2,
      clientData.localCreated,
    ];

    const results = await this.db.query(insertQuery, values);
    return results;
  }

  async addUser(userData: any) {
    const insertQuery =
      'INSERT INTO users (username, password, id_db, partner_id) VALUES (?, ?, ?, ?)';
    const values: any = [
      userData.username,
      userData.password,
      userData.idBase,
      JSON.stringify(userData.partnerId),
    ];
    const results = await this.db.query(insertQuery, values);
    return results;
  }

  async addCities(cities: any) {
    const insertQuery =
      'INSERT INTO cities (id, name, id_wharehouse) VALUES (?, ?, ?)';
    const values: any = [cities.id, cities.name, cities.id_wharehouse];
    const results = await this.db.query(insertQuery, values);
    return results;
  }

  async addApartments(apartments: any) {
    const insertQuery = 'INSERT INTO wharehouses (id, name) VALUES (?, ?)';
    const values: any = [apartments.id, apartments.name];
    const results = await this.db.query(insertQuery, values);
    return results;
  }

  async updateClient(clientData: any) {
    const insertQuery =
      'UPDATE client SET name = ?, address = ?, ruc = ?, city = ?, department = ?, email = ?, contactName = ?, contactPhone = ?, contactPhone2 = ? WHERE id = ?';
    const values: any = [
      clientData.name,
      clientData.address,
      String(clientData.ruc),
      clientData.city,
      clientData.department,
      clientData.email,
      clientData.contactName,
      clientData.contactPhone,
      clientData.contactPhone2,
      clientData.id,
    ];

    const results = await this.db.query(insertQuery, values);
    return results;
  }
}
