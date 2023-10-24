import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
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

import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { Product } from 'src/app/interface/product/product';

const states: Product[] = [
  {
    id: 1,
    name: 'San pham 1',
    import_price: 3,
    quantity: 3,
  },
  {
    id: 2,
    name: 'San pham 2',
    import_price: 6,
    quantity: 3,
  },
  {
    id: 3,
    name: 'San pham 3',
    import_price: 5,
    quantity: 3,
  },
];

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  import_priceValue: number = 0;
  quantity: number = 0;
  product: any = {};
  listSupplier: any = [];
  listLocation: any = [];
  products: any[] = [];
  input: any[] = [];
  tempProducts: any[] = [];
  storageImport = new FormGroup({
    inventory_transaction_id: new FormControl(''),
    reason: new FormControl('', Validators.required),
    note: new FormControl(''),
    partner_id: new FormControl(''),

    import_price: new FormControl(''),
    quantity: new FormControl(''),
    // input: new FormControl(''),
  });
  inputSerach = new FormGroup({
    input: new FormControl(''),
  });
  constructor(
    private _supplier: SuppliersService,
    private _location: LocationsService,
    private cdr: ChangeDetectorRef,
  ) {
    this._supplier.GetData().subscribe((res: any) => {
      this.listSupplier = res.payload.data;
    });
    // this._location.GetData().subscribe((res: any) => {
    //   this.listLocation = res.payload.data;
    // })
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : states
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  formatter = (x: { name: string }) => x.name;

  ngOnInit(): void {}
  searchProduct() {
    if (this.inputSerach.valid) {
      console.log(this.product.name);
      if (this.product) {
        this.products.push(this.product);
        this.inputSerach.reset();
        // this.cdr.detectChanges();
      }

      console.log(states);
    }
  }

  // updateImportPrice(i: number) {
  //   setTimeout(() => {
  //     return this.products[i].import_price = this.storageImport.value.import_price;
  //   }, 0);
  // }

  calculateTotal(index: number): number {
    return this.products[index].import_price * this.products[index].quantity;
  }

  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }

  onSubmit() {}
}
