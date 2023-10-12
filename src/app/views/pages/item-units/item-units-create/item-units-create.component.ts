import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ItemUnitsService } from 'src/app/service/item-units.service';

@Component({
  selector: 'app-item-units-create',
  templateUrl: './item-units-create.component.html',
  styleUrls: ['./item-units-create.component.scss']
})
export class ItemUnitsCreateComponent implements OnInit {
  unitsForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });
  constructor(private _unitsService: ItemUnitsService, private _router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.unitsForm.valid) {
      // console.log(this.brandForm.value);
      const dataToSend = {
        ...this.unitsForm.value,
        // created_date: new Date().toISOString(),
        // update_date: null,
      };

      this._unitsService.store(dataToSend).subscribe(
        (response) => {
          this.unitsForm.reset();
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "Thành công!",
            text: "Tạo đơn vị thành công.",
            icon: "success",
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          this._router.navigate(["../item-units/list"]);
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
    } else {
      console.log("Error create item-units!");
    }
  }
}
