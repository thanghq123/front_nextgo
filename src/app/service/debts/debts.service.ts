import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Debts } from './../../interface/debts/debts';

@Injectable({
  providedIn: 'root'
})
export class DebtsService extends CRUDServiceService<Debts> {
  private readonly domain_name: String;

  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('debts');
   this.domain_name = environment.domain_name;
 }
 getAllRecovery(){
  return this.http.post(`${this.apiUrl}/recovery`, this.handleData());
 }
 getAllRepay(){
  return this.http.post(`${this.apiUrl}/repay`, this.handleData());
 }
 handleData(data: any = {}) {
  return {
    domain_name: this.domain_name,
    ...data,
  };
}
}
