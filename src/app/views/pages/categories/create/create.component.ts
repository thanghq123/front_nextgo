import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/service/categories.service';
import Swal from 'sweetalert2';
import { Router} from '@angular/router';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  constructor(private categories: CategoriesService,  private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.categoryForm.valid) {
      const dataToSend = {
        ...this.categoryForm.value,
        created_date: new Date().toISOString(),
        update_date: null,
      };
      console.log(dataToSend);
      this.categories.createCategory(dataToSend).subscribe(
        (response) => {
          this.categoryForm.reset();
          Swal.fire('Thành công!', 'Tạo danh mục thành công.', 'success');
          this.router.navigate(['../categories/list']);
        },
        (error) => {
          if(error.error.status == false){
            Swal.fire('Lỗi!',`${error.error.meta.errors.name[0]}`, 'error');
          }
        }
      );
    } else {
      alert('Không để trống');
    }
  }
}
