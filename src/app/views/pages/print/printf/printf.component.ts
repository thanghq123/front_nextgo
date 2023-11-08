import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-printf',
  templateUrl: './printf.component.html',
  styleUrls: ['./printf.component.scss']
})
export class PrintfComponent implements OnInit {
  salesUnit : any;
  constructor() { }

  ngOnInit(): void {
    this.salesUnit = [
      {
        id : 0,
        name : 'Đơn bán hàng'
      }
    ]
  }

}
