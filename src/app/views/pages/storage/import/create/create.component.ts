import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ParamMap } from '@angular/router';
import { debounceTime, switchMap, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';

import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { Product } from 'src/app/interface/product/product';

const states: Product[] = [
  {
    id: 1,
    name: 'San pham 1',
    import_price: 3,
    quantity: 3
  },
   {
    id: 2,
    name: 'San pham 2',
    import_price: 6,
    quantity: 3
  },
  {
    id: 3,
    name: 'San pham 3',
    import_price: 5,
    quantity: 3
  },
];

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})


export class CreateComponent implements OnInit {
  import_priceValue: number = 0;
  quantity: number = 0;
  product: any = {};
  listSupplier: any = [];
  listLocation: any = [];
  products: any[] = [];
  input: any[] = [];
  import_price = new FormControl(0);
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
  })
  constructor(
    private _supplier: SuppliersService,
    private _location: LocationsService,
  ) {
    this._supplier.GetData().subscribe((res: any) =>{
      this.listSupplier = res.payload.data;
    })
    // this._location.GetData().subscribe((res: any) => {
    //   this.listLocation = res.payload.data;
    // })
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : states.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
    formatter = (x: {name: string}) => x.name;

  ngOnInit(): void {


    // this._location.GetData().subscribe((data: any) => {
    //   this.listLocation =
    //   data.status != 'error'
    //       ? data.results
    //       : [{ id: 0, name: `${data.message}` }];
    // });



    // console.log(this.listSupplier);
    this.import_price.valueChanges.subscribe(() => {
      this.updatePrice();
    });




  }


  updatePrice() {
    for (const product of this.products) {
      product.total = Number(this.import_price.value) * product.quantity;
    }
  }
  searchProduct(){
    // this.input.push(this.inputSerach.value.input)
    // console.log(this.input);
    const i = 0;

    if(this.inputSerach.valid){
    // states.forEach(value => {
    //   if(this.input[0].name == value.name){
      console.log(this.product.name);

      // const input = this.inputSerach.value.input != null && this.inputSerach.value.input != '' ? this.inputSerach.value.input : null;
      // const input2 = '';
      // console.log(input2.name);

      if(this.product){
        // if(of(input))
        this.products.push(this.product);
        this.inputSerach.reset();
      }

        console.log(this.products);
        console.log(states);


        // this.storageImport.patchValue(this.products[i])
        // i+1;
  //     }
  //     this.input = [];
  //     console.log(this.products);
    // });
  }
}
  // onImportPrice(){
  //   this.calculatorPrice()
  // }


  calculateTotal(index: number): number {
    return this.products[index].import_price * this.products[index].quantity;
  }

  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }

  onSubmit(){

  }

}
