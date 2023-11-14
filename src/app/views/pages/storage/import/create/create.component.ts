import { Component, OnInit } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { Product } from 'src/app/interface/product/product';
import { SearchProductService } from 'src/app/service/searchProduct/search-product.service';


import { StorageImportService } from 'src/app/service/storage/storage-import.service';
import { StorageImport } from 'src/app/interface/storage/storage-import';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  listSupplier: any = [];
  listLocation: any = [];
  listProduct: any[] = [];
  products: any[] = [];
  input: any = {};
  editRowID: any = '';
  price: any;
  quantity: any;
  isLoading = false;
  storageImportForm = new FormGroup({
    reason: new FormControl('', Validators.required),
    note: new FormControl(''),
    partner_id: new FormControl('', Validators.required),
    inventory_id: new FormControl('', Validators.required),
    price: new FormControl(''),
    quantity: new FormControl(''),

  });
  inputSerach = new FormGroup({
    input: new FormControl(''),
  });
  constructor(
    private _supplier: SuppliersService,
    private _location: LocationsService,
    private _storage: StorageImportService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private _product: SearchProductService
  ) {

    this._supplier.GetData().subscribe((res: any) => {
      this.listSupplier = res.payload.data;
      console.log(this.listSupplier);

    });
    this._product.GetData().subscribe((res: any) => {
      this.listProduct = res.payload;
      console.log(this.listProduct);
    })

    this._location.GetData().subscribe((res: any) => {
      this.listLocation = res.payload;

      // console.log(this.listLocation);
    })

  }
  Edit(val: any) {
    this.editRowID = val;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.listProduct
              .filter(
                (v) => v.variation_name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  formatter = (x: { variation_name: string }) => x.variation_name;

  searchProduct() {
    if (this.input != '') {
      // Kiểm tra xem sản phẩm vừa nhập có trùng với sản phẩm nào trong this.products không
      const existingProduct = this.products.find(
        (product) => product.variation_id === this.input.id
      );

      if (existingProduct) {
        // Nếu trùng, xóa sản phẩm đó khỏi mảng this.products
        const index = this.products.indexOf(existingProduct);
        this.products.splice(index, 1);
      }

      // Thêm sản phẩm mới vào mảng this.products
      const data = {
        name: this.input.variation_name,
        variation_id: this.input.id,
        batch_id: this.input.variation_quantities != '' ? this.input.variation_quantities[0].batch_id : 1,
        price: this.input.price_import,
        price_type: 0,
        quantity: 0,
      };
      let updatedProducts = [...this.products]; // Create a new array with existing products
      // Modify updatedProducts as needed (add, update, or remove items)
      updatedProducts.push(data); // Example: Adding a new product

      this.products = updatedProducts; // Assign the updated array back to this.products
      this.inputSerach.reset();

      this.cdr.detectChanges();
      console.log(this.products);
    }
  }
  calculateTotal(index1: number, index2: number): number {
    return index1 * index2;
  }
  calculateTotalPrice(): number {
    let total = 0;
    for (let i = 0; i < this.products.length; i++) {
      total += this.products[i].price * this.products[i].quantity;
    }
    return total;
  }
  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }

  onSubmit() {
    // If confirmed, delete the category
    if (this.storageImportForm.valid && this.products.length > 0) {
      const datasend = {
        reason: this.storageImportForm.value.reason,
        inventory_id: this.storageImportForm.value.inventory_id,
        partner_id: 1,
        partner_type: 0,
        trans_type: 0,
        note: this.storageImportForm.value.note,
        status: 1,
        created_by: 1,
        inventory_transaction_details: JSON.stringify(this.products),
      };
      console.log(datasend);
      this._storage.create(datasend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.storageImportForm.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Thêm đơn nhập thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate([
              `../storage/import/detail/${response.payload}`,
            ]);
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
      alert('Sản phẩm không được để trống');
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
