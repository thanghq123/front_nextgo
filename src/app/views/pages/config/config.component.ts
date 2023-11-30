import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../../../service/config/config.service";
import {Router} from "@angular/router";
import {BusinessField} from "../../../interface/business-field/business-field";
import {Tenant} from "../../../interface/tenant/tenant";
import {BusinessFieldService} from "../../../service/business-field/business-field.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, switchMap} from "rxjs/operators";
import {Subject} from "rxjs";
import {AresService} from 'src/app/service/ares/ares.service';
import {Config} from "../../../interface/config/config";
import {SettingService} from "../../../service/setting/setting.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  private provinceChangeSubject = new Subject<number>();

  private districtChangeSubject = new Subject<number>();

  provinces: any = [];

  districts: any = [];

  wards: any = [];

  errorMessages: any = [];

  isWardDataLoaded: boolean = false;

  businessFields: BusinessField[];

  tenant: Tenant;

  config: Config;

  businessTypes = [
    {
      value: 0,
      name: 'Hộ gia đình',
    },
    {
      value: 1,
      name: 'Cá nhân',
    },
  ];

  configForm = new FormGroup({
    business_name: new FormControl('', [Validators.required]),
    tel: new FormControl(''),
    business_field_code: new FormControl('', [Validators.required]),
    business_type: new FormControl(''),
    business_registration: new FormControl(''),
    license_date: new FormControl(''),
    license_address: new FormControl(''),
    province_code: new FormControl(''),
    district_code: new FormControl(''),
    ward_code: new FormControl(''),
    address_detail: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private configService: ConfigService,
    private businessFieldService: BusinessFieldService,
    private AresService: AresService,
    private settingService: SettingService
  ) {
    this.tenant = this.settingService.tenant;
  }

  ngOnInit(): void {
    this.getConfig();
    this.getBusinessFields();

    this.AresService.getProvinces().subscribe((data: any) => {
      this.provinces =
        data.status != 'error'
          ? data.results
          : [{id: 0, name: `${data.message}`}];
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
            : [{id: 0, name: `${data.message}`}];
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
            : {id: 0, name: `${data.message}`, status: false};
        this.isWardDataLoaded = data.status != 'error' ? true : false;
        if (this.wards && this.wards.status != false) {
          this.configForm
            ?.get('ward_code')
            ?.setValidators(Validators.required);
          this.configForm?.get('ward_code')?.updateValueAndValidity();
        } else {
          console.log(this.wards);
          this.configForm.value.ward_code = '';
        }
      });
  }

  getBusinessFields() {
    this.businessFieldService.getBusinessFields().subscribe((response: any) => {
      this.businessFields = response.payload;
    })
  }

  getConfig() {
    this.configService.getConfig().subscribe((response: any) => {
      this.config = response.payload;
      this.configForm.patchValue({
        business_name: this.config.business_name,
        tel: this.config.tel,
        business_field_code: this.config.business_field_code,
        business_type: this.config.business_type,
        business_registration: this.config.business_registration,
        license_date: this.config.license_date,
        license_address: this.config.license_address,
        province_code: this.config.province_code,
        district_code: this.config.district_code,
        ward_code: this.config.ward_code,
        address_detail: this.config.address_detail,
      })
    })
  }

  onProvinceChange(): void {
    this.provinceChangeSubject.next(
      Number(this.configForm.value.province_code)
    );
  }

  onDistrictChange(): void {
    this.districtChangeSubject.next(
      Number(this.configForm.value.district_code)
    );
  }

  onSubmit() {
    this.errorMessages = [];

    if (this.configForm.valid) {

      const data = this.configForm.value;

      const businessFieldId = this.businessFields.find((businessField: BusinessField) => businessField.code == data.business_field_code)?.id;


      const formData = {
        id: String(this.config.id),
        business_name: String(data.business_name),
        tel: data.tel,
        business_field_code: String(data.business_field_code),
        business_field_id: String(businessFieldId),
        business_type: String(data.business_type),
        business_registration: String(data.business_registration),
        license_date: String(data.license_date),
        address_detail: String(data.address_detail),
        province_code: data.province_code ? String(data.province_code) : '',
        district_code: data.province_code ? String(data.province_code) : '',
        license_address: String(data.license_address),
        ward_code: data.ward_code ? String(data.ward_code) : '',
      }

      this.configService.update(formData).subscribe(
        (response: any) => {
          if (response.status == true) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: "Cập nhật thành công",
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate([`../setting/`]);
          } else {
            this.errorMessages = response.meta;
            if (this.errorMessages.domain_name) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                title: 'Thất bại!',
                text: this.errorMessages.domain_name,
                icon: 'error',
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });
            }
          }
        },
        (error) => {
          console.log(error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );
    }
  }

  handleDate = (date: any) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const dt = dateObj.getDate();
    return `${dt < 10 ? '0' + dt : dt}/${month < 10 ? '0' + month : month}/${year}`;

  }
}
