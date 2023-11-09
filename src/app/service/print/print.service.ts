import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Print } from 'src/app/interface/print/print';

@Injectable({
  providedIn: 'root'
})
export class PrintService extends CRUDServiceService<Print>  {

  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('printed_forms');
 }

}
