import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Observable } from 'rxjs';
import {ConfigService} from "../config/config.service";
@Injectable({
  providedIn: 'root'
})
export class ReportService extends CRUDServiceService<any> {
  private readonly domain_name: String;
  constructor(http: HttpClient, dataService: HandleDataService, private configService: ConfigService,) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('report');
    this.domain_name = this.configService.domain_name;
  }

  general() {
    return this.http.post(
      `${this.apiUrl}/general`,
      {
        domain_name: this.domain_name
      })
    }

    income(option: string,start_date : string = '',end_date : string = '') {
      return this.http.post(
        `${this.apiUrl}/general`,
        {
          domain_name: this.domain_name,
          location : this.configService.location_id,
          option : option,
          start_date,
          end_date
        })
      }

  
}
