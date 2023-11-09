import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ListProductsService {
  private apiUrlProducts : string = environment.apiTennatv1;
  constructor(private http: HttpClient) { }
  getProducts() {
    return this.http.post(`${this.apiUrlProducts}get-product`,{ domain_name: "tenant1",
    location: 1});
  }

}
