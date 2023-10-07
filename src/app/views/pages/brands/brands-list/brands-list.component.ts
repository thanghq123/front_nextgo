import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

import { Brands } from 'src/app/interface/brands/brands';
import { BrandsService } from 'src/app/service/brands.service';
import { DataTable } from 'simple-datatables';
import { log } from 'console';



@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss']
})
export class BrandsListComponent implements OnInit, AfterViewInit {
  listBrands: Observable<Brands[]>;

  constructor(
    private _brandService: BrandsService
    ) {
      this.listBrands = new Observable();
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit(): void {
    this.listBrands.subscribe(() => {
      setTimeout(() => {
        const db = new DataTable('#dataTableExample');
        setTimeout(() => {
          const db = new DataTable('#dataTableExample');
          db.on('datatable.init', () => {
            this.addDeleteEventHandlers();
        });
        }, 0)
      }, 0);
    });
  }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-danger');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteBrand(Number(id));
      });
    });
  }

  // ...

  deleteBrand(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa nó!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, delete the category
        this._brandService.deleteBrand(id).subscribe(
          (response) => {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1000,
              title: "Đã xóa!",
              text: "Thương hiệu đã được xóa.",
              icon: "success",
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
            // Navigate to the list after successful deletion
            // this.refreshData();
            setTimeout(() => {
              location.reload();
            }, 1000);
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa.', 'error');
          }
        );
      }
    });
  }

  refreshData(): void{
    this._brandService.getData().subscribe({
      next: (res: any) => {
        // console.log(res.status);
        if(res.status == true){
          this.listBrands = of(res.payload) ;
          // console.log(this.listBrands);
          this.listBrands.subscribe(
            (res)=> {
              setTimeout(() => {
                const db = new DataTable('#dataTableExample');
                db.on('datatable.init', () => {
                  this.addDeleteEventHandlers();
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



}
