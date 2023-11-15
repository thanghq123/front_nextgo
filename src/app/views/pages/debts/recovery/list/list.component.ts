import { Component, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Debts } from 'src/app/interface/debts/debts';
import { DebtsService } from 'src/app/service/debts/debts.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListRecoveryComponent implements OnInit, AfterViewInit{
  listRecovery: Observable<any>;
  isLoading = false;
  basicModalCloseResult: string = '';

  constructor(
    private _recoService: DebtsService,
    private modalService: NgbModal

  ) {
    this.listRecovery = new Observable();
   }

  ngOnInit(): void {
    this.refreshData();
  }

  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, {}).result.then((result) => {
      this.basicModalCloseResult = "Modal closed" + result
    }).catch((res) => {});
  }

  ngAfterViewInit(): void {
    // this.listRecovery.subscribe(() => {
    //   setTimeout(() => {
    //     const db = new DataTable('#dataTableExample');
    //     setTimeout(() => {
    //       const db = new DataTable('#dataTableExample');
    //       db.on('datatable.init', () => {
    //         this.addDeleteEventHandlers();
    //     });
    //     }, 0)
    //   }, 0);
    // });
  }

  // addDeleteEventHandlers(): void {
  //   const deleteButtons = document.getElementsByClassName('btn-danger');
  //   Array.from(deleteButtons).forEach((button) => {
  //     button.addEventListener('click', (event) => {
  //       const id = (event.target as Element).getAttribute('id');
  //       this.deleteReco(Number(id));
  //     });
  //   });
  // }

  // deleteReco(id: number) {
  //   Swal.fire({
  //     title: 'Bạn có chắc chắn muốn xóa?',
  //     text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Có, xóa nó!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // If confirmed, delete the category
  //       this._recoService.delete(id).subscribe(
  //         (response) => {
  //           Swal.fire({
  //             toast: true,
  //             position: "top-end",
  //             showConfirmButton: false,
  //             timer: 1000,
  //             title: "Đã xóa!",
  //             text: "Thương hiệu đã được xóa.",
  //             icon: "success",
  //             timerProgressBar: true,
  //             didOpen: (toast) => {
  //               toast.addEventListener("mouseenter", Swal.stopTimer);
  //               toast.addEventListener("mouseleave", Swal.resumeTimer);
  //             },
  //           });
  //           // Navigate to the list after successful deletion

  //           setTimeout(() => {
  //             location.reload();
  //           }, 1000);
  //         },
  //         (error) => {
  //           if(error.success == false){
  //             Swal.fire('Lỗi!',`${error.meta.name}`, 'error');
  //           }
  //         }
  //       );
  //     }
  //   });
  // }

  refreshData(): void{
    this.isLoading = true;
    this._recoService.getAllRecovery().subscribe({
      next: (res: any) => {
        // console.log(res.data);
        if(res.status == true){
          this.listRecovery = of(res.payload.data) ;
          console.log(res.payload.data);
          this.isLoading = false;
          // console.log(this.listBrands);
          this.listRecovery.subscribe(
            (res)=> {
              setTimeout(() => {
                const db = new DataTable('#dataTableExample');
                db.on('datatable.init', () => {
                  // this.addDeleteEventHandlers();
              });
              }, 0)
            })

        }
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra.', 'error');
      }
    })
  }

  status(key: number): any{
    // const result = [];
    if(key == 0){
       return ['Quá hạn', 'bg-danger'];
    }else if(key == 1){
      return ['Chưa thanh toán', 'bg-warning'];
    }else if(key == 2){
      return ['Thanh toán 1 phần', 'bg-primary']
    }else if(key == 3){
      return ['Đã thanh toán', 'bg-success']
    }

  }

}
