import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Print } from 'src/app/interface/print/print';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrintService extends CRUDServiceService<Print> {
  private readonly domain_name: String;
  constructor(http: HttpClient, dataService: HandleDataService) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('printed_forms');
    this.domain_name = environment.domain_name;
  }
  createData(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/store`,
      this.dataService.handleData(data)
    );
  }
  returnForm(id: number){
    return this.http.post<any>(
      `${this.apiUrl}/return`,
      this.dataService.handleData(id)
    );
  }
}
