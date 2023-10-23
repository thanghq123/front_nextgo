import { Component, OnInit,TemplateRef } from '@angular/core';
import { ItemUnitsService } from 'src/app/service/item-units.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/service/products/products.service';
import { CategoriesService } from 'src/app/service/categories/categories.service';
import { BrandsService } from 'src/app/service/brands.service';
import { WarrantiesService } from 'src/app/service/warranties/warranties.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isLoading = false;
  item_units: any ;
  categories: any ;
  brands : any ;
  warranties :  any ;
  manage_type : any;
  dataAttributes: string = '';
  simpleItems: { id: number, text: string }[] = [];
  newItemText: string = '';
  nextItemId: number = 1;

  itemBoxTypeQuality : number = 1;
  itemBoxId : number = 1;
  itemBoxTypeQualityArray: any[] = Array(this.itemBoxTypeQuality).fill(null);
  productsForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  constructor(
    private ProductsService: ProductsService,
    private router: Router,
    private ItemUnitsService : ItemUnitsService,
    private CategoriesService : CategoriesService,
    private BrandsService : BrandsService,
    private WarrantiesService : WarrantiesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.manage_type = [
      { id: 0, name: 'Thường' },
      { id: 1, name: 'Theo Lô/HSD' },
    ];
    // this.ItemUnitsService.GetData().subscribe((data: any) => {
    //   this.item_units = data.payload.data;
    // });
    this.isLoading = true;
     this.ItemUnitsService.get().subscribe((data: any) => {
      this.item_units = data.payload.data;
    });

      this.CategoriesService.GetData().subscribe((data: any) => {
      this.categories = data.payload.data;
    });

    this.BrandsService.getData().subscribe((data: any) => {
      this.brands = data.payload.data;
    });

    this.WarrantiesService.GetData().subscribe((data: any) => {
      this.warranties = data.payload.data;
    });
    this.isLoading = false; 
  }
  sortableConfig = {
  };

  addAttributesForm(){
    this.itemBoxTypeQuality++;
    this.itemBoxTypeQualityArray = Array(this.itemBoxTypeQuality).fill(null);
    
  }
  addItem() {
    if (this.newItemText.trim() !== '') {
      this.simpleItems.push({ id: this.nextItemId++, text: this.newItemText });
      this.newItemText = '';
      console.log(this.simpleItems);
      
    }
  }

  removeItem(index: number) {
    console.log(this.simpleItems);
    this.simpleItems.splice(index, 1);
  }

  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, {}).result.then((result) => {
      // this.dataAttributes = "Modal closed" + result
      console.log(result);
      
    }).catch((res) => {});
  }

  onSubmit() {
    if (this.productsForm.valid) {
      const dataToSend = {
        name: this.productsForm.value.name || '',
        created_at: new Date(),
        updated_at: null,
      };
      // this.ProductsService.create(dataToSend).subscribe(
      //   (response: any) => {
      //     if (response.status == true) {
      //       this.productsForm.reset();
      //       Swal.fire({
      //         toast: true,
      //         position: 'top-end',
      //         showConfirmButton: false,
      //         timer: 3000,
      //         title: 'Thành công!',
      //         text: 'Thêm thành công',
      //         icon: 'success',
      //         timerProgressBar: true,
      //         didOpen: (toast) => {
      //           toast.addEventListener('mouseenter', Swal.stopTimer);
      //           toast.addEventListener('mouseleave', Swal.resumeTimer);
      //         },
      //       });
      //       this.router.navigate(['../categories/list']);
      //     } else {
      //       console.log(response);
      //       const errorMessages = [];
      //       for (const key in response.meta.errors) {
      //         errorMessages.push(...response.meta.errors[key]);
      //       }
      //       const message = errorMessages.join(' ');

      //       Swal.fire({
      //         toast: true,
      //         position: 'top-end',
      //         showConfirmButton: false,
      //         timer: 3000,
      //         title: 'Thất bại!',
      //         text: message,
      //         icon: 'error',
      //         timerProgressBar: true,
      //         didOpen: (toast) => {
      //           toast.addEventListener('mouseenter', Swal.stopTimer);
      //           toast.addEventListener('mouseleave', Swal.resumeTimer);
      //         },
      //       });
      //     }
      //   },
      //   (error) => {
      //     console.log(error);
      //     Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
      //   }
      // );
    } else {
      alert('Không để trống');
    }
  }
}
