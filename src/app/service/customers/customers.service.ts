import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Customers } from 'src/app/interface/customers/customers';
@Injectable({
  providedIn: 'root'
})
export class CustomersService extends CRUDServiceService<Customers> {
  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('customers');
 }
}
