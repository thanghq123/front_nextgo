import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categories } from 'src/app/interface/categories/categories';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'https://651da02744e393af2d5a1b47.mockapi.io/categories/categories';
  constructor(private http: HttpClient) { }

  GetData(data: any) : Observable<Categories[]> {
    return this.http.post<Categories[]>(`${this.apiUrl}`,data);
  }

  createCategory(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  
  getCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`,data);
  }

  updateCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  deleteCategory(data : any): Observable<any> {
    return this.http.post(`${this.apiUrl}`,data);
  }
}
