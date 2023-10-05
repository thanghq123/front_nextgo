import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/service/categories.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  constructor(private categories: CategoriesService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.categoryForm.valid) {
      const dataToSend = {
        ...this.categoryForm.value,
        created_date: new Date().toISOString(),
        update_date: null,
        domain_name: 'tenant1',
      };

      this.categories.createCategory(dataToSend).subscribe(
        (response) => {
          this.categoryForm.reset();
          Swal.fire('Thành công!', 'Tạo danh mục thành công.', 'success');
        },
        (error) => {
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );
    } else {
      alert('Không để trống');
    }
  }
}
