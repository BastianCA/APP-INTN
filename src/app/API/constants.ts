import { environment } from 'src/environments/environment';

export abstract class Constants {
  static readonly API_URL: string = environment.API_URL;
  static readonly API_URL_PUBLIC: string = environment.API_URL_PUBLIC;
}
