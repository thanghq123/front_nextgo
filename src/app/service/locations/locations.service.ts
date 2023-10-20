import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Locations } from 'src/app/interface/locations/locations';

@Injectable({
  providedIn: 'root'
})
export class LocationsService extends CRUDServiceService<Locations> {

  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('locations');
 }
}
