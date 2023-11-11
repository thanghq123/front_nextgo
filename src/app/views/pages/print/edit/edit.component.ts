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
    this.myContent = `<div class="bfs-font bfs-m bill-body bill-print-body bta-default" id="bill-body-id">
<div class="bfs-bold bfs-l bta-left"><strong>{Ten_Cua_hang}</strong></div>

<div class="bfs-s bta-left" id="mc_address">{Ten_Chi_Nhanh} - {Dia_Chi_Chi_Nhanh}</div>

<div class="bfs-s bta-left" id="mc_phone">{Dien_Thoai_Chi_Nhanh}
<hr />
<p style="text-align:center">&nbsp;</p>

<h2 style="text-align:center"><strong>H</strong><strong>&Oacute;A&nbsp;ĐƠN B&Aacute;N H&Agrave;NG</strong></h2>
</div>

<div class="bill-row">
<div class="bfs-s bill-col-left-4 bill-row">
<table border="0" cellpadding="1" cellspacing="1" style="width:100%">
\t<tbody>
\t\t<tr>
\t\t\t<td><strong>Ng&agrave;y:</strong>&nbsp;&nbsp;{Ngay_Tao}</td>
\t\t\t<td><strong>HĐ: {Ma_Don_Hang}</strong></td>
\t\t</tr>
\t\t<tr>
\t\t\t<td><strong>Nh&acirc;n vi&ecirc;n:</strong>&nbsp;{Nguoi_Phu_Trach}</td>
\t\t\t<td>&nbsp;</td>
\t\t</tr>
\t</tbody>
</table>

<p>&nbsp;</p>

<p>&nbsp;</p>
</div>
</div>

<div class="bill-col-left-5 bill-text-bold">
<table align="center" border="0" cellpadding="1" cellspacing="1" style="width:100%">
\t<tbody>
\t\t<tr>
\t\t\t<td style="text-align:justify; width:40%"><strong>Sản phẩm</strong></td>
\t\t\t<td style="text-align:justify"><strong>Đơn gi&aacute;</strong></td>
\t\t\t<td style="text-align:justify"><strong>Số lượng</strong></td>
\t\t\t<td style="text-align:justify"><strong>Th&agrave;nh tiền</strong></td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>{Ten_Phien_Ban}</td>
\t\t\t<td>{Don_Gia}</td>
\t\t\t<td>{So_Luong_Ban}</td>
\t\t\t<td>{Thanh_Tien}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>KM</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Chiet_khau_Phien_Ban}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Thuế SP</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Thue_Phien_Ban}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Cộng tiền h&agrave;ng</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Tong_Tien_Hang}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Chiết khấu SP</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Tong_Chiet_Khau_San_Pham}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Chiết khấu đơn</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Chiet_Khau_Don_Hang}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Tổng tiền thuế</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Tong_Thue}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Ph&iacute; kh&aacute;c</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Phi_Khac}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>
\t\t\t<h3><strong>TỔNG TIỀN</strong></h3>
\t\t\t</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Tong_Can_Thanh_Toan}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Tiền kh&aacute;ch đưa</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Khach_Thanh_Toan}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Ghi nợ</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Tien_No}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>Tiền trả lại</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Tien_Tra}</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>
\t\t\t<h4><strong>Kh&aacute;ch h&agrave;ng:</strong></h4>
\t\t\t</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Ten_Khach_Hang</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>
\t\t\t<h4><strong>SĐT:&nbsp;&nbsp;</strong></h4>
\t\t\t</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>&nbsp;</td>
\t\t\t<td>{Dien_Thoai_Khach}</td>
\t\t</tr>
\t</tbody>
</table>

<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
</div>

<h3 class="bfs-bold" style="text-align:center"><strong>CẢM ƠN QU&Yacute; KH&Aacute;CH V&Agrave; HẸN GẶP LẠI</strong></h3>

<h3 class="bfs-bold" style="text-align:center"><strong>Powered by NextShop</strong></h3>
</div>

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
          // this._router.navigate(['../item-units/list']);
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
