import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {SettingService} from "../setting/setting.service";

@Injectable({
  providedIn: 'root',
})
export class HandleDataService {
  private readonly domain_name: String;

  constructor(
    private settingService: SettingService,
  ) {
    this.settingService.updateValues();
    this.domain_name = this.settingService.domain_name;
  }

  getUrl(serviceTennat: string): string {
    return environment.apiTennatv1 + serviceTennat;
  }

  getPulicUrl(serviceTennat: string): string {
    return environment.apiPublicv1 + serviceTennat;
  }

  handleData(data: any = {}) {
    if (typeof data !== 'object' || Array.isArray(data)) {
      data = {id: data};
    }
    return {
      domain_name: this.domain_name,
      location_id: 1,
      ...data,
    };
  }

  handle(data: any) {
    return {
      domain_name: this.domain_name,
      location_id: 1,
      ...data,
    };
  }
}
