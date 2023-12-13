import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { CategoriesService } from 'src/app/service/categories/categories.service';
import { Categories } from 'src/app/interface/categories/categories';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  ListsCategories: Observable<Categories[]>;
  currentPage: number = 1;
  isLoading = false;
  dataTable: DataTable | null = null;
  totalPage: number;

  constructor(private categoriesService: CategoriesService) {
    this.ListsCategories = new Observable();
  }

  ngOnInit(): void {
    this.refreshCategories(true);
  }

  // ngAfterViewInit(): void {
  // const dataTableElement = document.getElementById('dataTableExample');
  // if (dataTableElement) {
  //   const db = new DataTable(dataTableElement);
  //   db.on('datatable.init', () => {
  //     this.addDeleteEventHandlers();
  //   });
  // }
  // }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-danger');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteCategory(Number(id));
      });
    });
  }

  changePage(page: number) {
    // console.log(page);

    const oldPage = page;
    if (page == oldPage) {
    }
  }

  // ...

  deleteCategory(id: number) {
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
        this.categoriesService.delete(id).subscribe(
          (response) => {
            Swal.fire('Đã xóa!', 'Danh mục của bạn đã được xóa.', 'success');
            // Navigate to the list after successful deletion
            // location.reload();
            this.refreshCategories(false);
          },
          (error) => {
            if (error.success == false) {
              Swal.fire('Lỗi!', `${error.meta.name}`, 'error');
            }
          }
        );
      }
    });
  }
  pageChange(page: number) {
    this.refreshCategories(false);
  }

  refreshCategories(status: boolean): void {
    this.isLoading = true;
    this.categoriesService.GetDataPanigate(this.currentPage).subscribe(
      (response: any) => {
        if (response.status == true) {
          this.ListsCategories = of(response.payload.data);
          this.isLoading = false;
          this.totalPage = response.payload.total;
          // console.log(this.totalPage);

          if (this.dataTable) {
            this.dataTable.destroy();
          }

          // console.log(this.ListsCategories);
          this.ListsCategories.subscribe((categories) => {
            setTimeout(() => {
              let options = {
                searchable: true,
              };
              const dataTableElement =
                document.getElementById('dataTableExample');
              // if ((status = true)) {
                if (dataTableElement) {
                  const db = new DataTable(dataTableElement, options);

                  db.on('datatable.init', () => {
                    db.destroy();
                    this.addDeleteEventHandlers();
                  });
                }
            }, 0);
          });
        }
        // Navigate to the list after successful deletion
      },
      (error) => {
        // console.log(error);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa danh mục.', 'error');
      }
    );
  }
}
