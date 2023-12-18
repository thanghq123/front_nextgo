import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HandleDataService} from "../baseHandle/handle-data.service";
import {LocalStorageService} from "../localStorage/localStorage.service";
import {AuthService} from "../auth/auth.service";
import {environment} from "../../../environments/environment";
import {SettingService} from "../setting/setting.service";

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private publicApiUrl;

  private tenantApi;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private settingService: SettingService,
  ) {
    this.publicApiUrl = environment.apiPublicv1;
    this.tenantApi = environment.apiTennatv1;
  }

  getTenantsByUser() {
    const token = this.authService.getToken('tenant_token');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${token}`)
    }
    return this.http.get<any>(`${this.publicApiUrl}tenants`, header);
  }

  create(data: any) {
    const token = this.authService.getToken('tenant_token');
    const user = this.localStorageService.get('tenant_token').user;
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${token}`)
    }
    return this.http.post<any>(`${this.publicApiUrl}tenants/store`, {user_id: user.id, ...data}, header);
  }

  get tenant() {
    const token = this.authService.getToken();
    const tenant = this.settingService.tenant;
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${token}`)
    }
    return this.http.post<any>(`${this.tenantApi}`, {domain_name: tenant.name}, header);
  }
}
