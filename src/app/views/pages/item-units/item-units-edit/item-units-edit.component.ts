import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ItemUnitsService } from 'src/app/service/item_units/item-units.service';

@Component({
  selector: 'app-item-units-edit',
  templateUrl: './item-units-edit.component.html',
  styleUrls: ['./item-units-edit.component.scss']
})
export class ItemUnitsEditComponent implements OnInit {
  id: any;
  name: string;
  unitsForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(255)]),
  });
  constructor(
    private _unitsService: ItemUnitsService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((queryParams) => {
      const id = queryParams.get("id");
      if (id !== null) {
        this.id = id;

        this._unitsService.find(id).subscribe(
          (data) => {
            this.name = data.payload["name"];
            // console.log(this.name);

            this.unitsForm.patchValue(data.payload);
          },
          (error) => {
            Swal.fire("Lỗi!", "Có lỗi xảy ra dữ liệu.", "error");
          }
        );
      } else {
        this._router.navigate(["../item-units/list"]);
      }
    });
  }

  onSubmit() {
    if (this.unitsForm.valid) {
      const dataToSend = {
        ...this.unitsForm.value,
        update_date: new Date().toISOString(),
        id: this.id,
      };

      this._unitsService.update(dataToSend).subscribe(
        (response) => {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "Thành công!",
            text: "Bạn đã cập nhật đơn vị tính thành công",
            icon: "success",
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          this._router.navigate(["/item-units/list"]);
        },
        (error) => {
          // console.log((error));

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
    } else {
      alert("Không để trống");
    }
  }
}
