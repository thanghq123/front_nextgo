import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { StorageImport } from 'src/app/interface/storage/storage-import';


@Injectable({
  providedIn: 'root'
})
export class StorageImportService extends CRUDServiceService<any> {

  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('storage/import');
 }
}
