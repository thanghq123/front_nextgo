import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { LocationsService } from 'src/app/service/locations/locations.service';
import { AresService } from 'src/app/service/ares/ares.service';
import { log } from 'console';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  status: any = [];
  is_main: any = [];
  private provinceChangeSubject = new Subject<number>();
  private districtChangeSubject = new Subject<number>();
  provinces: any = [];
  districts: any = [];
  wards: any = [];
  isWardDataLoaded: boolean = false;
  img: File | null;
  locationsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    image: new FormControl(''),
    description: new FormControl(''),
    tel: new FormControl('', Validators.required),
    email: new FormControl(''),

    province_code: new FormControl(''),
    district_code: new FormControl(''),
    ward_code: new FormControl(''),
    address_detail: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    is_main: new FormControl('', Validators.required),
  });

  constructor(
    private _locaService: LocationsService,
    private AresService: AresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.status = [
      { id: 0, name: 'Đóng cửa' },
      { id: 1, name: 'Hoạt động' },
    ];
    this.is_main = [
      { id: 0, name: 'Chi nhánh mặc định' },
      { id: 1, name: 'Chi nhánh phụ' },
    ];
    this.AresService.getProvinces().subscribe((data: any) => {
      this.provinces =
        data.status != 'error'
          ? data.results
          : [{ id: 0, name: `${data.message}` }];
    });

    this.provinceChangeSubject
      .pipe(
        debounceTime(300),
        switchMap((province_code) =>
          this.AresService.getDistricts(province_code)
        )
      )
      .subscribe((data) => {
        this.districts =
          data.status != 'error'
            ? data.results
            : [{ id: 0, name: `${data.message}` }];
      });

    this.districtChangeSubject
      .pipe(
        debounceTime(300),
        switchMap((district_code) => this.AresService.getWards(district_code))
      )
      .subscribe((data) => {
        this.wards =
          data.status != 'error'
            ? data.results
            : { id: 0, name: `${data.message}`, status: false };
        this.isWardDataLoaded = data.status != 'error' ? true : false;
      });
  }

  onProvinceChange(): void {
    this.provinceChangeSubject.next(
      Number(this.locationsForm.value.province_code)
    );
  }

  onDistrictChange(): void {
    this.districtChangeSubject.next(
      Number(this.locationsForm.value.district_code)
    );
  }

  onFileChange(event: any) {
    const files = event.target.files;

    if (files && files.length > 0) {
      const img = files[0];

      // Kiểm tra loại tệp
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(img.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Loại tệp không hợp lệ. Chỉ chấp nhận các tệp JPG, PNG hoặc GIF.'
        }).then(() => {
          // Sau khi hiển thị lỗi, reset giá trị của input file
          event.target.value = '';
        });
        return;
      }

      // Kiểm tra kích thước tệp (ví dụ: không quá 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (img.size > maxSizeInBytes) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Kích thước tệp quá lớn. Vui lòng chọn một tệp nhỏ hơn 5MB.'
        }).then(() => {
          // Sau khi hiển thị lỗi, reset giá trị của input file
          event.target.value = '';
        });
        return;
      }

      // Lưu trữ tệp hình ảnh và tiếp tục xử lý nếu tệp hợp lệ
      this.img = img;
      console.log('Tệp hình ảnh hợp lệ.');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không có tệp nào được chọn.'
      }).then(() => {
        // Sau khi hiển thị lỗi, reset giá trị của input file
        event.target.value = '';
      });
      return;
    }
  }




  onSubmit() {
    if (this.locationsForm.valid) {
      const dataToSend = {
        name: String(this.locationsForm.value.name),

        province_code: Number(this.locationsForm.value.province_code) || null,
        district_code: Number(this.locationsForm.value.district_code) || null,
        ward_code: Number(this.locationsForm.value.ward_code) || null,
        address_detail: String(this.locationsForm.value.address_detail) || null,

        email: String(this.locationsForm.value.email) || null,
        tel: String(this.locationsForm.value.tel),
        description: String(this.locationsForm.value.description) || null,
        image: this.img || null,

        status: Number(this.locationsForm.value.status),
        is_main: Number(this.locationsForm.value.is_main),
        created_by: 1,

        // created_at: new Date(),
        // updated_at: null,
      };

      console.log(dataToSend);

      this._locaService.create(dataToSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.locationsForm.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Thêm khách hàng thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate(['../suppliers/list']);
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
        },
        (error) => {
          console.log(error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );
    } else {
      alert('Không để trống');
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
