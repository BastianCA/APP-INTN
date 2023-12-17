import { Constants } from '../API/constants';

export abstract class login {
  static readonly login = Constants.API_URL + '/validate_user';
  static readonly SEND_DATA = Constants.API_URL + '/save_json';
  static readonly GET_CITIES = Constants.API_URL + '/get_cities';
  static readonly GET_WHAREHOUSES = Constants.API_URL + '/get_departments';
}
