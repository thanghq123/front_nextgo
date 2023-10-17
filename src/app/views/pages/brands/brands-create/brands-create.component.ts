import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { BrandsService } from "src/app/service/brands.service";
@Component({
  selector: "app-brands-create",
  templateUrl: "./brands-create.component.html",
  styleUrls: ["./brands-create.component.scss"],
})
export class BrandsCreateComponent implements OnInit {
  brandForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });
  constructor(private _brandService: BrandsService, private _router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.brandForm.valid) {
      // console.log(this.brandForm.value);
      const dataToSend = {
        ...this.brandForm.value,
        // created_date: new Date().toISOString(),
        // update_date: null,
      };

      this._brandService.createBrand(dataToSend).subscribe(
        (response) => {
          this.brandForm.reset();
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "Thành công!",
            text: "Tạo thương hiệu thành công.",
            icon: "success",
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          this._router.navigate(["../brands/list"]);
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
      console.log("Error create brand!");
    }
  }
}
