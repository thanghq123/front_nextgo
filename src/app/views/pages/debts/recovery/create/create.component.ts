import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ParamMap } from '@angular/router';
import {
  debounceTime,
  switchMap,
  distinctUntilChanged,
  map,
  catchError
} from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';
import { CustomersService } from 'src/app/service/customers/customers.service';

const statesWithFlags: {name: string, flag: string}[] = [
  {'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},
  {'name': 'Alaska', 'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},
  {'name': 'Arizona', 'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},
  {'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},
  {'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},
  {'name': 'Colorado', 'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},
  {'name': 'Connecticut', 'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},
  {'name': 'Delaware', 'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},
  {'name': 'Florida', 'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},
];

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateRecoveryComponent implements OnInit {
  model: any;

  recoveryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    principal: new FormControl('', Validators.required),
    debit_at: new FormControl('', Validators.required),
    due_at: new FormControl('', Validators.required),
    note: new FormControl(''),
  });
  constructor(
    private _customerService: CustomersService,

  ) { }

  ngOnInit(): void {
  }
  searchTerm : any[] = [];

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      switchMap(searchTerm => this._customerService.searchName(this.model)),
      // console.log();

      map(term => term === '' ? []
        : this.searchTerm.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  formatter = (x: {name: string}) => x.name;

  onSubmit(): void {

  }

}
