import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HandleDataService {
  private readonly domain_name: String;

  constructor() {
    this.domain_name = environment.domain_name;
  }

  getUrl(serviceTennat: string): string {
    return environment.apiTennatv1 + serviceTennat;
  }

  handleData(data: any = {}, location_id: null|number = null) {
    if (typeof data !== 'object' || Array.isArray(data)) {
      data = {id: data};
    }
    return {
      domain_name: this.domain_name,
      location_id: location_id,
      ...data,
    };
  }

  handle(data: any) {
    return {
      domain_name: this.domain_name,
      location: 1,
      ...data,
    };
  }
}
