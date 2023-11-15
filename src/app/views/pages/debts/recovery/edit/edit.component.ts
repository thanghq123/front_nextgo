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
    partner_name: new FormControl(''),
    status: new FormControl(''),
    id: new FormControl(''),
  });

  debt: any;
  id: any;
  isLoading = false;

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
        this.isLoading = true;
        this._debtService.GetOneRecord(id).subscribe(
          (data) => {
            const debtData = data.payload;
            this.debt = data.payload;
            // console.log(this.debt);
            this.recoveryFormEdit.patchValue({
              name: debtData.name,
              amount_debt: debtData.amount_debt,
              debit_at: debtData.debit_at,
              due_at: debtData.due_at,
              note: debtData.note,
              partner_name: debtData.partner_name,
              status: debtData.status
            });
            this.isLoading = false;
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
  status(number: number): string {
    let result = '';

    switch (number) {
      case 0:
        result = 'Quá hạn';
        break;
      case 1:
        result = 'Chưa thanh toán';
        break;
      case 2:
        result = 'Thanh toán 1 phần';
        break;
      case 3:
        result = 'Đã thanh toán';
        break;
      default:
        result = 'Trạng thái không xác định';
        break;
    }

    return result;
  }
  onSubmit(): void {
    if (this.recoveryFormEdit.valid) { // Kiểm tra xem form có hợp lệ không trước khi log dữ liệu
      const dataSend = {
        id: this.id,
        name: String(this.recoveryFormEdit.value.name),
        amount_debt: Number(this.recoveryFormEdit.value.amount_debt),
        debit_at: String(this.recoveryFormEdit.value.debit_at),
        due_at: String(this.recoveryFormEdit.value.due_at),
        note: String(this.recoveryFormEdit.value.note),
        type: 0
      }
      console.log(dataSend);
      this._debtService.update(dataSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.recoveryFormEdit.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Cập nhật thông tin khoản thu thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            location.reload();
          } else {
            console.log(response);
            const errorMessages = [];
            for (const key in response.meta.errors) {
              const messages = response.meta.errors[key];
              for (const message of messages) {
                errorMessages.push(`${key}: ${message}`);
              }
            }
            this.showNextMessage(errorMessages);
          }
        }
      )
      // Log dữ liệu từ form
      // Bạn có thể xử lý dữ liệu ở đây, gửi nó đến server hoặc thực hiện các hành động khác
    } else {
      console.log('Form không hợp lệ!'); // Log nếu form không hợp lệ
    }
  }
  showNextMessage(errorMessages: any) {
    if (errorMessages.length > 0) {
      const message = errorMessages.shift();
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Thất bại!',
        text: message,
        icon: 'error',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        didClose: () => {
          this.showNextMessage(errorMessages);
        },
      });
    }
  }
  }


