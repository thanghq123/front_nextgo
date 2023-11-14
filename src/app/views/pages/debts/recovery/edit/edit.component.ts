import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ParamMap } from '@angular/router';
import {
  debounceTime,
  switchMap,
  distinctUntilChanged,
  map,
  catchError,
} from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';
import { CustomersService } from 'src/app/service/customers/customers.service';
import { DebtsService } from 'src/app/service/debts/debts.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditRecoveryComponent implements OnInit {
  recoveryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    principal: new FormControl('', Validators.required),
    debit_at: new FormControl('', Validators.required),
    due_at: new FormControl('', Validators.required),
    partner: new FormControl(''),
    note: new FormControl(''),
  })
  constructor() { }

  ngOnInit(): void {
  }
  onSubmit(): void {

  }

}
