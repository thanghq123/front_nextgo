import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
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
  recoveryFormEdit = new FormGroup({
    name: new FormControl('', Validators.required),
    amount_debt: new FormControl('', Validators.required),
    debit_at: new FormControl('', Validators.required),
    due_at: new FormControl('', Validators.required),
    note: new FormControl(''),
    // id_user: new FormControl(''),
    partner_name: new FormControl(''),
    status: new FormControl('')
  })
  debt: any;
  id: string;

  constructor(
    private _debtService: DebtsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((queryParams) => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;
        // this.isLoading = true;
        this._debtService.GetOneRecord(id).subscribe(
          (data) => {
            const debtData = data.payload;
            this.recoveryFormEdit.patchValue(debtData);
            console.log(debtData);

            // this.isLoading = false; // Stop loading
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
      } else {
        this.router.navigate(['debts/recovery/list']);
      }
    });
  }
  onSubmit(): void {
    console.log(this.recoveryFormEdit.value);

  }

}
