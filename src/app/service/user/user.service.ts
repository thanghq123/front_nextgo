import { Injectable } from '@angular/core';
import {CRUDServiceService} from "../baseHandle/crudservice.service";
import {Suppliers} from "../../interface/suppliers/suppliers";
import {HttpClient} from "@angular/common/http";
import {HandleDataService} from "../baseHandle/handle-data.service";
import {User} from "../../interface/user/user";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CRUDServiceService<any> {

  constructor(
    http: HttpClient,
    dataService: HandleDataService
  ) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('user');
  }
  GetAllUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, this.dataService.handleData(data), this.header);
  }
}
