import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Customers } from 'src/app/interface/customers/customers';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomersService extends CRUDServiceService<Customers> {
  private apiUrlProducts : string = environment.apiTennatv1;
  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('customers');
 }


 createQuickly(data :  any) {
  console.log({ domain_name: "tenant1",
  location: 1,statusCreate : 1,...data});
  
   return this.http.post(`${this.apiUrlProducts}customers/store`,{ domain_name: "tenant1",
   location: 1,statusCreate : 1,...data});
 }
}
