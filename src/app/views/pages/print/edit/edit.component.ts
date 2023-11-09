import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ParamMap } from '@angular/router';
import {
  debounceTime,
  switchMap,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { PrintService } from 'src/app/service/print/print.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  listLocation: any;
  salesUnit: any[] = [];
  printSize: any[] = [];
  public myContent: string = '';
  isLoading = true;

  constructor(
    private _locationService: LocationsService,
    private modalService: NgbModal,
    private _printService: PrintService,
    private _router: Router
  ) {
    this.myContent = `<div class="bfs-font bfs-m bta-default bill-print-body bill-body" id="bill-body-id">

    <div class="bfs-l bfs-bold bta-left">{Ten_Cua_hang}</div>

    <div class="bfs-s bta-left" id="mc_address">{Ten_Chi_Nhanh} - {Dia_Chi_Chi_Nhanh}</div>

    <div class="bfs-s bta-left" id="mc_phone">{Dien_Thoai_Chi_Nhanh}</div>

    <div class="bill-dash-line">&nbsp;</div>

    <div class="bfs-space-l">&nbsp;</div>

    <div class="bfs-bold bfs-x bfs-space-l">HÓA ĐƠN BÁN HÀNG</div>

    <div class="bfs-space-x">&nbsp;</div>

    <div class="bill-row">
    <div class="bill-row bill-col-left-4 bfs-s">
    <div class="bfs-bold">Ngày:&nbsp;&nbsp;</div>

    <div>{Ngay_Tao}</div>
    </div>

    <div class="bill-row bill-col-left-4 bfs-s">
    <div class="bfs-bold">HĐ:&nbsp;&nbsp;</div>

    <div>{Ma_Don_Hang}</div>
    </div>
    </div>

    <div class="bill-row bfs-s">
    <div class="bfs-bold">Nhân viên:&nbsp;&nbsp;</div>

    <div id="phone">{Nguoi_Phu_Trach}</div>
    </div>

    <div class="bfs-space-s">&nbsp;</div>

    <div class="bill-row bfs-bold">
    <div class="bill-text-bold bill-col-left-5">Sản phẩm</div>

    <div class="bill-text-bold bill-col-right-2">Đơn giá</div>

    <div class="bill-text-bold bill-col-right-2">Số lượng</div>

    <div class="bill-text-bold bill-col-right-2">Thành tiền</div>
    </div>

    <div class="bill-solid-line">&nbsp;</div>
    <!--START line item-->

    <div class="bill-row">
    <div class="bill-col-left-5">{Ten_Phien_Ban}</div>

    <div class="bill-col-right-2">{Don_Gia}</div>

    <div class="bill-col-right-2">{So_Luong_Ban}</div>

    <div class="bill-col-right-2">{Thanh_Tien}</div>
    </div>

    <div class="bill-row bill_item_promotion_container" style="font-style: italic">
    <div class="bill-col-left-4">KM</div>

    <div class="bill-col-right-4 bill_item_promotion">{Chiet_khau_Phien_Ban}</div>
    </div>

    <div class="bill-row bill_item_tax_container" style="font-style: italic">
    <div class="bill-col-left-4">Thuế SP</div>

    <div class="bill-col-right-4 bill_item_tax">{Thue_Phien_Ban}</div>
    </div>

    <div class="bill-dash-line">&nbsp;</div>
    <!--END line item-->

    <div class="bill-row">
    <div class="bill-col-left-4">Cộng tiền hàng</div>

    <div class="bill-col-right-4">{Tong_Tien_Hang}</div>
    </div>

    <div class="bill-row">
    <div class="bill-col-left-4">Chiết khấu SP</div>

    <div class="bill-col-right-4">{Tong_Chiet_Khau_San_Pham}</div>
    </div>

    <div class="bill-row">
    <div class="bill-col-left-4">Chiết khấu đơn</div>

    <div class="bill-col-right-4">{Chiet_Khau_Don_Hang}</div>
    </div>

    <div class="bill-row">
    <div class="bill-col-left-4">Tổng tiền thuế</div>

    <div class="bill-col-right-4">{Tong_Thue}</div>
    </div>

    <div class="bill-row" style="margin-bottom: 5px">
    <div class="bill-col-left-4">Phí khác</div>

    <div class="bill-col-right-4">{Phi_Khac}</div>
    </div>

    <div class="bill-row">
    <div class="bill-col-left-4 bfs-bold">TỔNG TIỀN</div>

    <div class="bill-col-right-4 bfs-bold">{Tong_Can_Thanh_Toan}</div>
    </div>

    <div class="bill-dash-line">&nbsp;</div>

    <div class="bill-row">
    <div class="bill-col-left-4">Tiền khách đưa</div>

    <div class="bill-col-right-4">{Khach_Thanh_Toan}</div>
    </div>

    <div class="bill-row" id="bill_debt_container" style="font-style: italic">
    <div class="bill-col-left-4">Ghi nợ</div>

    <div class="bill-col-right-4" id="bill_debt">{Tien_No}</div>
    </div>

    <div class="bill-row">
    <div class="bill-col-left-4">Tiền trả lại</div>

    <div class="bill-col-right-4">{Tien_Tra}</div>
    </div>

    <div class="bill-solid-line">&nbsp;</div>

    <div class="bill-row" id="customer_name_container">
    <div class="bill-col-left-3 bfs-bold">Khách hàng:&nbsp;&nbsp;</div>

    <div class="bill-col-right-5" id="customer_name">{Ten_Khach_Hang}</div>
    </div>

    <div class="bill-row" id="customer_phone_container">
    <div class="bill-col-left-3 bfs-bold">SĐT:&nbsp;&nbsp;</div>

    <div class="bill-col-right-5" id="customer_phone">{Dien_Thoai_Khach}</div>
    </div>

    <div class="bill-dash-line" id="bill-bottom-dash-line">&nbsp;</div>

    <div class="bfs-space-x">&nbsp;</div>

    <div class="bfs-bold">CẢM ƠN QUÝ KHÁCH VÀ HẸN GẶP LẠI</div>

    <div class="bfs-bold">Powered by NextShop</div>
    <script type="text/javascript">
        function checkAndHideId(targetId, condition, containerIds) {
          var target = document.getElementById(targetId);
          var targetValue = target.innerHTML.trim();
          if (targetValue == "&nbsp;" || targetValue == condition) {
            for (const containerId of containerIds) {
              var container = document.getElementById(containerId);
              container.style.display = "none";
            }
          }
          return;
        }
        function checkAndHideClass(containerClass, condition, targetClass) {
          var containers = document.getElementsByClassName(containerClass);
          for (const container of containers) {
            var targets = container.getElementsByClassName(targetClass);
            if (targets) {
              if (
                targets[0] &&
                (targets[0].innerHTML.trim() == "&nbsp;" ||
                  targets[0].innerHTML.trim() == condition)
              ) {
                container.style.display = "none";
              }
            }
          }
          return;
        }
        checkAndHideId("mc_address", "", ["mc_address"]);
        checkAndHideId("mc_phone", "", ["mc_phone"]);
        checkAndHideId("bill_debt", "0", ["bill_debt_container"]);
        checkAndHideId("customer_name", "Khách vãng lai", [
          "customer_name_container",
          "bill-bottom-dash-line",
        ]);
        checkAndHideId("customer_name", "Khách vãng lai", [
          "customer_phone_container",
        ]);
        checkAndHideClass(
          "bill_item_promotion_container",
          "0",
          "bill_item_promotion"
        );
        checkAndHideClass("bill_item_tax_container", "0", "bill_item_tax");
      </script></div>
    `;

    console.log(this.myContent);
    
    this._locationService.GetData().subscribe(
      (res: any) => {
        this.isLoading = true;
        if (res.status == true) {
          this.listLocation = res.payload;
          this.isLoading = false;
          // console.log(this.listLocation);
        }
      },
      (error) => {
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi load chi nhánh.', 'error');
      }
    );
  }

  ngOnInit(): void {
    this.salesUnit = [
      {
        id: 0,
        name: 'Đơn bán hàng',
      },
    ];

    this.printSize = [
      {
        id: 0,
        name: 'Khổ in A4',
      },
      {
        id: 1,
        name: 'Khổ in A5',
      },
      {
        id: 2,
        name: 'Khổ in K57',
      },
      {
        id: 3,
        name: 'Khổ in K80',
      },
    ];
  }
  openXlModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, { size: 'xl' })
      .result.then((result) => {
        console.log('Modal closed' + result);
      })
      .catch((res) => {});
  }

  onSubmit() {
    // this.submitEvent.emit();
    const dataSend = {
      name: 'Đơn bán hàng',
      form: this.myContent,
      default: 1,
    };
    this._printService.create(dataSend).subscribe(
      (response: any) => {
        if (response.status == true) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Thêm thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          this._router.navigate(['../item-units/list']);
        } else {
          console.log(response);
          const errorMessages = [];
          for (const key in response.meta.errors) {
            errorMessages.push(...response.meta.errors[key]);
          }
          const message = errorMessages.join(' ');

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
          });
        }
      },
      (error) => {
        // console.log(error);
        if (error.error.status == false) {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "Lỗi!",
            text: `${error.error.meta.errors.name[0]}`,
            icon: "error",
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
        }
      }
    );
  }
}
