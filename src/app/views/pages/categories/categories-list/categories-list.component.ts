import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { CategoriesService } from 'src/app/service/categories.service';
import { Categories } from 'src/app/interface/categories/categories';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit, AfterViewInit {
  ListsCategories: Observable<Categories[]>;
  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.refreshCategories();
  }

  ngAfterViewInit(): void {
    this.ListsCategories.subscribe(() => {
      setTimeout(() => {
        const dataTable = new DataTable('#dataTableExample');
        dataTable.on('datatable.init', () => {
          this.addDeleteEventHandlers();
        });
      }, 0);
    });
  }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-danger');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteCategory(Number(id));
      });
    });
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
        const data = {
          domain_name: 'tenant1',
          id: id,
        };
        this.categoriesService.deleteCategory(data).subscribe(
          (response) => {
            Swal.fire('Đã xóa!', 'Danh mục của bạn đã được xóa.', 'success');
            // Navigate to the list after successful deletion
            location.reload();
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa danh mục.', 'error');
          }
        );
      }
    });
  }

  refreshCategories(): void {
    const datasend = {
      domain_name: 'tenant1',
    };
    this.ListsCategories = this.categoriesService.GetData(datasend);
  }
}
