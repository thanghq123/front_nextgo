import { StorageImportService } from 'src/app/service/storage/storage-import.service';
import { StorageImport } from 'src/app/interface/storage/storage-import';
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
import { ProductsService } from 'src/app/service/products/products.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  listProduct: any = [];
  listSupplier: any = [];
  listLocation: any = [];
  products: any[] = [];
  tableData: any[] = [];
  input: any = {};
  editRowID: any = '';
  price: any;
  quantity: any;
  storageImportForm = new FormGroup({
    reason: new FormControl('', Validators.required),
    note: new FormControl(''),
    partner_id: new FormControl(''),
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
    private _product: ProductsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this._supplier.GetData().subscribe((res: any) => {
      this.listSupplier = res.payload.data;
      // console.log(this.listSupplier);

    });

    this.tableData = [
      {
        id: 13,
        name: 'San pham 1',
        inventory_transaction_id: 22102023,
        variation_id: 2,
        batch_id: 1,
        price: 11000,
        price_type: 0,
        quantity: 10,
        created_at: '2023-10-21T05:34:20.000000Z',
        updated_at: '2023-10-21T05:34:20.000000Z',
      },
      {
        id: 14,
        name: 'San pham 2',
        variation_id: 3,
        batch_id: 3,
        price: 13000,
        price_type: 0,
        quantity: 10,
      },
      {
        id: 15,
        name: 'San pham 3',
        variation_id: 4,
        batch_id: 4,
        price: 15000,
        price_type: 0,
        quantity: 10,
      },
    ];

    this._location.GetData().subscribe((res: any) => {
      this.listLocation = res.payload;
      // console.log(this.listLocation);
    })
    this._product.GetData().subscribe((res: any) => {
      this.listProduct = res.payload.data;
      console.log(this.listProduct);
    })
  }
  Edit(val: any) {
    this.editRowID = val;
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.tableData
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  formatter = (x: { name: string }) => x.name;

  ngOnInit(): void {}
  searchProduct() {
    if (this.input) {
      // Kiểm tra xem sản phẩm vừa nhập có trùng với sản phẩm nào trong this.products không
      const existingProduct = this.products.find(
        (product) => product.variation_id === this.input.variation_id
      );

      if (existingProduct) {
        // Nếu trùng, xóa sản phẩm đó khỏi mảng this.products
        const index = this.products.indexOf(existingProduct);
        this.products.splice(index, 1);
      }

      // Thêm sản phẩm mới vào mảng this.products
      const data = {
        name: this.input.name,
        variation_id: this.input.variation_id,
        batch_id: this.input.batch_id,
        price: this.input.price,
        price_type: this.input.price_type,
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
    if (this.storageImportForm.valid) {
      const datasend = {
        reason: this.storageImportForm.value.reason,
        inventory_id: 1,
        partner_id: this.storageImportForm.value.partner_id,
        partner_type: 1,
        trans_type: 0,
        note: this.storageImportForm.value.note,
        status: 0,
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
                errorMessages.push(`${message}`);
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
