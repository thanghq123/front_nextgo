import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/service/categories.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.scss']
})
export class EditCategoriesComponent implements OnInit {
  originalData: any;
  id:string;
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  constructor(private categories : CategoriesService,private route: ActivatedRoute,  private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(queryParams => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;

        this.categories.getCategory(id).subscribe(data => {
          this.categoryForm.patchValue(data.payload);
          this.originalData = { ...data.payload };
        }, error => {
          console.log(error.error.meta);
          if(error.error.status == false){
            Swal.fire('Lỗi!',`${error.error.meta}`, 'error');
            this.router.navigate(['../categories/list']);
          }
        });
      } else {
        this.router.navigate(['../categories/list']);
      }
    })
  }

  isFormChanged() {
    return this.categoryForm.value.name !== this.originalData.name;
  }
  onSubmit() {
    if (this.categoryForm.valid) {
    const dataToSend = {
      ...this.categoryForm.value,
      update_date: new Date().toISOString(),
      id : this.id
    };
    
      this.categories.updateCategory(dataToSend).subscribe(
        response => {
         Swal.fire(
          'Thành công!',
          'Bạn đã cập nhật danh mục thành công',
          'success'
        );
        this.router.navigate(['/categories/list'])
        },
        error => {
          if(error.error.status == false){
            Swal.fire('Lỗi!',`Có lỗi xảy ra vui lòng hiện hệ quản trị viên`, 'error');
          }
        }
      );
    }else {
      alert("Không để trống")
    }
    
  }
}
