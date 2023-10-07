import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BrandsService } from 'src/app/service/brands.service';
import { log } from 'console';

@Component({
  selector: 'app-brands-edit',
  templateUrl: './brands-edit.component.html',
  styleUrls: ['./brands-edit.component.scss']
})
export class BrandsEditComponent implements OnInit {
  id: any;
  name: string;
  brandForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(255)])
  })
  constructor(
    private _brandService: BrandsService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(queryParams => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;

        this._brandService.getBrand(id).subscribe(data => {
          this.name = data.payload['name'];
          // console.log(this.name);

          this.brandForm.patchValue(data.payload);
        }, error => {
          Swal.fire(
            'Lỗi!',
            'Có lỗi xảy ra khi gửi dữ liệu.',
            'error'
          );
        });
      } else {
        this._router.navigate(['../brands/list']);
      }
    })
  }

  onSubmit(){
    if (this.brandForm.valid) {
      const dataToSend = {
        ...this.brandForm.value,
        update_date: new Date().toISOString(),
        id : this.id
      };

        this._brandService.updateBrand(dataToSend).subscribe(
          response => {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "Thành công!",
            text: "Bạn đã cập nhật danh mục thành công",
            icon: "success",
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          this._router.navigate(['/brands/list'])
          },
          error => {
            Swal.fire(
              'Lỗi!',
              'Có lỗi xảy ra khi gửi dữ liệu.',
              'error'
            );
          }
        );
      }else {
        alert("Không để trống")
      }
    }
}
