import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categories } from 'src/app/interface/categories/categories';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = environment.apiTennatv1 + 'categories';
  private readonly domain_name : String;
  constructor(private http: HttpClient) {
    this.domain_name = environment.domain_name;
   }

  GetData() {
    return this.http.post(`${this.apiUrl}`,this.handleData());
  }

  createCategory(data: any) {
    return this.http.post(`${this.apiUrl}/store`, this.handleData(data));
  }

  
  getCategory(id : string): Observable<any> {
    return this.http.post(`${this.apiUrl}/show`,this.handleData({id  : id}));
  }

  updateCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, this.handleData(data));
  }

  deleteCategory(id : number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`,this.handleData({id : id}));
  }

  handleData(data : any = {}){
    return {
      domain_name : this.domain_name,
      ...data
    }
  }
}
