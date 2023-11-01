import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabshop',
  templateUrl: './tabshop.component.html',
  styleUrls: ['./tabshop.component.scss'],
})
export class TabshopComponent implements OnInit {
  quantity: number = 0;
  basicModalCloseResult: string = '';
  modelRadio = '%';
  modelTypePay = '';
  defaultAccordionCode: any;
  constructor(
    private modalService: NgbModal,
  ) {}


  ngOnInit(): void {
  }

  scrollTo(element: any) {
    element.scrollIntoView({behavior: 'smooth'});
  }

  openBasicModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, {})
      .result.then((result) => {
        console.log(result);
        if(result){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Áp dụng thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
        
      })
      .catch((res) => {});
  }

  
  openLgModal(content: TemplateRef<any>) {
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }



  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }
}
