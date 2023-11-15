import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Payment } from 'src/app/interface/payment/payment';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService extends CRUDServiceService<any> {
  private readonly domain_name: String;
  constructor(http: HttpClient, dataService: HandleDataService) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('payment');
    this.domain_name = environment.domain_name;
  }

  createPayment(data : any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/order/${data.id}`,
      this.dataService.handleData(data)
    );
  }
  createDebtPayment(data : any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/debt`,
      this.dataService.handleData(data)
    );
  }


  handleData(data: any = {}) {
    return {
      domain_name: this.domain_name,
      ...data,
    };
  }
}
