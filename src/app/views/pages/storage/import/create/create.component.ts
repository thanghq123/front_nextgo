import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { data } from 'jquery';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  listSupplier: any = [];
  listLocation: any = [];
  storageImport = new FormGroup({
    inventory_transaction_id: new FormControl(''),
    reason: new FormControl('', Validators.required),
    note: new FormControl(''),
    partner_id: new FormControl(''),


  })
  constructor(
    private _supplier: SuppliersService,
    private _location: LocationsService
  ) {
    this._supplier.GetData().subscribe((res: any) =>{
      this.listSupplier = res.payload.data;
    })
    // this._location.GetData().subscribe((res: any) => {
    //   this.listLocation = res.payload.data;
    // })
  }

  ngOnInit(): void {

    // this._location.GetData().subscribe((data: any) => {
    //   this.listLocation =
    //   data.status != 'error'
    //       ? data.results
    //       : [{ id: 0, name: `${data.message}` }];
    // });



    // console.log(this.listSupplier);

  }

  onSubmit(){

  }

}
