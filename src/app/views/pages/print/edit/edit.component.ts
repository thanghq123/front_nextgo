import { Component, OnInit } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {


  constructor(

  ) {
    // this.handle();
  }

  ngOnInit(): void {
  }

  // public model = {
  //   name: "Hardik",
  //   description: "<p>This is a sample form using CKEditor 4.</p>"
  // };
  // public onChange(event: CKEditor4.EventInfo) {
  //   console.log(event.editor.getData());
  // }

  // handle(){
  //   for (let index = 0; index < 2; index++) {
  //     this.onSubmit()
  //   }

  // }

  // onSubmit() {
  //   console.log(`Form submit, model: ${JSON.stringify(this.model)}`);
  // }
  title = 'angular';
  // public Editor = ClassicEditor;


}
