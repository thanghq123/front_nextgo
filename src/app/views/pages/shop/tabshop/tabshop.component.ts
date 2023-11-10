import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DatalayoutService } from 'src/app/service/handleDataComponent/datalayout.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/service/customers/customers.service';
import { ListProducts } from 'src/app/interface/listProduct/list-products';
import { ListProductsService } from 'src/app/service/listProduct/list-products.service';
@Component({
  selector: 'app-tabshop',
  templateUrl: './tabshop.component.html',
  styleUrls: ['./tabshop.component.scss'],
})
export class TabshopComponent implements OnInit {
  quantity: number = 0;
  basicModalCloseResult: string = '';
  modelRadio = 1;
  modelTypePay = '';
  defaultAccordionCode: any;
  listProductCart: any;
  tabDefault: number = 0 ;
  currentPrice: number;
  priceFormModal: number;
  discount: number = 0;
  tax: number = 0;
  dataCurrent: any;
  totalMoney :  number;
  productValues : any = {};
  modalData :  any;
  singleTax : number = 0;
  DiscountBill : number = 0;
  taxBill : number = 0;
  modelRadioBill : number = 1;
  priceBill : number = 0;
  dataBill :  any;
  cashPrice : number = 0;
  paymentPrice : number = 0;
  changeBill : number = 0;
  noteBill : string ;
  people : any = [];
  selectedSearchPersonId: string = '';
  dataAdd: {
    name : string,
    tel : string
  } = {
    name : '',
    tel : ''
  }
  dataPerson : any;
  dataInfoUser : any;
  ListProducts: any[];
  constructor(
    private modalService: NgbModal,
    private DatalayoutService: DatalayoutService,
    private CustomersService : CustomersService,
    private ListProductsService : ListProductsService
  ) {}

  ngOnInit(): void {
   
    console.log( this.ListProducts);
    this.ListProductsService.getProducts().subscribe((data : any) => {
      this.ListProducts = Object.values(data.payload);
      console.log(data.payload);
      
      if(data.payload){
        for (const iterator in data.payload) {
          console.log(data.payload[iterator]);
          for (const item of data.payload[iterator]) {
            item.quantity = item.variation_quantities.reduce((sum : number,valueCurrent : any) => sum + valueCurrent.quantity,0)
            
          }
          
        }
      }
  
   
 
      
      // variation_quantities
    })
    
    this.CustomersService.GetData().subscribe((response : any) => {
      // console.log(response.payload.data);
      this.people = response.payload;
      if(response.payload.length > 0) {
        this.people.forEach((person : any) => {
          person.displayName = `${person.name} - ${person.tel}`;
        });
      }
    
      
    })
    this.DatalayoutService.currentData.subscribe((data) => {
      if (data.hasOwnProperty('tabOrder')) {
        this.dataCurrent = data.tabOrder;
        this.listProductCart = data.tabOrder.map((value: any, index: number) => {
            return value.ListProductCart;
        });

        this.dataInfoUser = data.tabOrder.map((value: any, index: number) => {
          return value.infoOrder;
      });
      if(Object.keys(data.tabOrder[this.tabDefault].infoOrder).length > 0){
        this.selectedSearchPersonId = data.tabOrder[this.tabDefault].infoOrder.id;
      }
    } else {
      this.dataCurrent = this.dataCurrent;
        this.listProductCart = this.dataCurrent.map((value: any, index: number) => {
            return value.ListProductCart;
        });
        this.dataInfoUser = this.dataCurrent.map((value: any, index: number) => {
          return value.infoOrder;
      });
      if(Object.keys(this.dataCurrent[this.tabDefault].infoOrder).length > 0){
        this.selectedSearchPersonId = this.dataCurrent[this.tabDefault].infoOrder.id;
      }
    }
      // this.dataCurrent = data.tabOrder;
      // this.listProductCart = data.tabOrder.map((value: any, index: number) => {
      //   return value.ListProductCart;
      // });

      this.totalMoney = this.listProductCart[this.tabDefault].reduce((total : number,current : any)=>{
        return total + current.result;
      },0)
     
      this.tabDefault = data.tabCurrent;
      this.modalData =  data.tabModal;
      console.log(this.dataBill);
      if(!this.dataBill){
        this.dataBill = data.dataBill;
        this.priceBill = data.dataBill[this.tabDefault].totalPrice;
        this.singleTax = data.dataBill[this.tabDefault].discount;
        this.DiscountBill = data.dataBill[this.tabDefault].tax;
        this.taxBill = data.dataBill[this.tabDefault].service;
        this.modelRadioBill = data.dataBill[this.tabDefault].radio;
        this.cashPrice = data.dataBill[this.tabDefault].cash;
        this.changeTotalBill();
        if(data.dataBill[this.tabDefault].note){
          this.noteBill = data.dataBill[this.tabDefault].note;
          this.noteBillEvent()
        }
      }

     
      
    });



    this.DatalayoutService.eventCurrent.subscribe(event => {
      let dataOrder = null;
      let dataBill  = null;
      switch (event.name) {
        case 'addTabOder':
        
          if(this.dataCurrent.length < 4){
            this.totalMoney = 0;
            this.dataCurrent.push( {
              ListProductCart: [],
              infoOrder: {}
            } )
            this.dataBill.push(  {
              discount : 0,
              tax : 0,
              totalPrice : 0,
              service : 0,
              radio : 1,
              cash : 0
            })
            this.tabDefault = this.dataCurrent.length -1;
            dataOrder = this.dataCurrent;
            dataBill = this.dataBill;
            this.listProductCart = this.dataCurrent.map((value: any, index: number) => {
              return value.ListProductCart;
            });
            this.singleTax = this.dataBill[this.tabDefault].discount;
            this.DiscountBill = this.dataBill[this.tabDefault].tax;
            this.taxBill = this.dataBill[this.tabDefault].service;
            this.modelRadioBill = this.dataBill[this.tabDefault].radio;
            this.priceBill = this.dataBill[this.tabDefault].totalPrice;
            this.cashPrice = this.dataBill[this.tabDefault].cash;
            this.changeTotalBill();
            if(this.dataBill[this.tabDefault].note){
              this.noteBill = this.dataBill[this.tabDefault].note;
              this.noteBillEvent()
            }

            if(Object.keys(this.dataCurrent[this.tabDefault].infoOrder).length > 0){
              this.selectedSearchPersonId = this.dataCurrent[this.tabDefault].infoOrder.id;
            }else {
              this.selectedSearchPersonId = '';
            }
            localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
            localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
            this.DatalayoutService.changeData({tabCurrent : this.tabDefault});
            localStorage.setItem('TabCurrentIndex', JSON.stringify(this.tabDefault));
            // window.location.reload();
    
            
          }else {
            dataOrder = this.dataCurrent;
            dataBill = this.dataBill;
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thất bại!',
              text: 'Đơn hàng đã đạt giới hạn vui lòng thanh toán 4 đơn hàng trước đó',
              icon: 'error',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          }
          
          this.dataCurrent = dataOrder;
          this.dataBill = dataBill;
          console.log(this.dataBill);
          break;
        case 'changeTab':
          const {id} = event.data;
          this.tabDefault = id;
          this.totalMoney = this.listProductCart[this.tabDefault].reduce((total : number,current : any)=>{
            return total + current.result;
          },0)
          this.singleTax = this.dataBill[this.tabDefault].discount;
          this.DiscountBill = this.dataBill[this.tabDefault].tax;
          this.taxBill = this.dataBill[this.tabDefault].service;
          this.modelRadioBill = this.dataBill[this.tabDefault].radio;
          this.priceBill = this.dataBill[this.tabDefault].totalPrice
          this.cashPrice = this.dataBill[this.tabDefault].cash;
          this.changeTotalBill();
          if(this.dataBill[this.tabDefault].note){
            this.noteBill = this.dataBill[this.tabDefault].note;
            this.noteBillEvent()
          }else {
            this.noteBill = '';
          }

          console.log(this.dataCurrent[this.tabDefault]);
          
          if(Object.keys(this.dataCurrent[this.tabDefault].infoOrder).length > 0){
            this.selectedSearchPersonId = this.dataCurrent[this.tabDefault].infoOrder.id;
          }else {
            this.selectedSearchPersonId = '';
          }
          localStorage.setItem('TabCurrentIndex', JSON.stringify(this.tabDefault));
          break;
          case 'removeTab' :
            const {idRemove,modalData} = event.data;
            
            if (idRemove > 0) {
              console.log(modalData);
               this.modalData = modalData.splice(this.tabDefault, 1);
              console.log(this.modalData);
              
              this.dataCurrent.splice(idRemove, 1);
              this.dataBill.splice(idRemove, 1);
              // this.modalData = modalData.splice(this.tabDefault, 1);
              this.tabDefault = idRemove == 0 ? 0 : idRemove-1;
              this.singleTax = this.dataBill[this.tabDefault].discount;
              this.DiscountBill = this.dataBill[this.tabDefault].tax;
              this.taxBill = this.dataBill[this.tabDefault].service;
              this.modelRadioBill = this.dataBill[this.tabDefault].radio;
              this.priceBill = this.dataBill[this.tabDefault].totalPrice
              dataOrder = this.dataCurrent;
              dataBill = this.dataBill;
              if(Object.keys(this.dataCurrent[this.tabDefault].infoOrder).length > 0){
                this.selectedSearchPersonId = this.dataCurrent[this.tabDefault].infoOrder.id;
              }else {
                this.selectedSearchPersonId = '';
              }
        
              localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
              localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
              // localStorage.setItem('TabModal', JSON.stringify(this.modalData));
              this.DatalayoutService.changeData({tabCurrent : this.tabDefault});
              localStorage.setItem('TabCurrentIndex', JSON.stringify(this.tabDefault));
            }
            this.dataCurrent = dataOrder;
            this.dataBill = dataBill;
            break;
        default:
            throw new Error('Error Event component');
      }
    });
  }

  peopleEvent() : void{
    const selectedPerson = this.people.find((person : any) => person.id === this.selectedSearchPersonId);
    this.dataPerson = selectedPerson;
    this.updateBill(this.dataInfoUser,this.tabDefault,selectedPerson)
    localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
    
  }

  scrollTo(element: any) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  noteBillEvent() : void{
      this.updateBill(this.dataBill,this.tabDefault,{
        note : this.noteBill
      })
      localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
  }
  changeTotalBill(){
    if(this.cashPrice > this.priceBill){
      this.changeBill = this.cashPrice - this.priceBill;
      this.paymentPrice = 0;
    }else {
      this.changeBill = 0;
      this.paymentPrice = this.priceBill - this.cashPrice;
    }
  }
  resultBill(idTab : number) {
    console.log(idTab);
    
    let priceCurrent = null;

    if (this.modelRadioBill === 1) {
      const total = this.totalMoney * Number(this.DiscountBill)
       priceCurrent =
        this.totalMoney -
        total / 100 +
        ((this.totalMoney -
          total / 100) *
          this.singleTax) /
          100 + Number(this.taxBill);
    } else {
      const total = this.totalMoney - Number(this.DiscountBill);
       priceCurrent =
       total +
        (total *
          this.singleTax) /
          100 + Number(this.taxBill);
    }
    this.priceBill = priceCurrent;
    // console.log(this.dataBill[idTab]);
    // console.log(this.dataBill[this.tabDefault]);
    
    this.updateBill(this.dataBill,idTab,{
      discount :  this.singleTax,
      tax : this.DiscountBill,
      totalPrice : this.priceBill,
      service : this.taxBill,
      radio : this.modelRadioBill
    });
    localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
  }

  changeCash(event  : any) : void {
    if (!(event.target.value)) { 
      this.cashPrice = 0;
      event.target.value = 0;
  }

  if(this.cashPrice > this.priceBill){
    this.changeBill = this.cashPrice - this.priceBill;
    this.paymentPrice = 0;
  }else {
    this.changeBill = 0;
    this.paymentPrice = this.priceBill - this.cashPrice;
  }
    console.log(event.target.value);
     this.updateBill(this.dataBill,this.tabDefault,{
      cash : this.cashPrice
    });
    localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
  }






  resultTotal(e: any) {

    
    this.updateQuantity(
      this.listProductCart[this.tabDefault],
      +e.target.id,
      +e.target.value,
      e.target.name
    );
    this.totalMoney = this.listProductCart[this.tabDefault].reduce((total : number,current : any)=>{
      return total + current.result;
    },0)
    localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
  }
  openBasicModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, {})
      .result.then((result) => {
        console.log(result);
        if (result) {
          console.log(this.dataCurrent);
          console.log(this.dataInfoUser);
          
          console.log(this.dataAdd);
          this.updateBill(this.dataInfoUser,this.tabDefault,this.dataAdd)
          console.log(this.dataCurrent);
          this.CustomersService.createQuickly(this.dataAdd).subscribe((data : any) => {
            console.log(data);
            if(data.status){
              this.people = data.payload;
              if(data.payload.length > 0) {
                this.people.forEach((person : any) => {
                  person.displayName = `${person.name} - ${person.tel}`;
                });
              }
              const dataFind = data.payload.find((person : any) => person.name === this.dataAdd.name)
              this.selectedSearchPersonId = dataFind.id;
              this.updateBill(this.dataInfoUser,this.tabDefault,dataFind)
              localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
          }else {
            console.log(data);
            
            const errorMessages = [];
            for (const key in data.meta.errors) {
              const messages = data.meta.errors[key];
              for (const message of messages) {
                errorMessages.push(`${key}: ${message}`);
              }
            }
            this.showNextMessage(errorMessages);
          }
          })
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

  removeItemCart(id: number) {
    if (id > -1) {
      this.listProductCart[this.tabDefault].splice(id, 1);
      this.totalMoney = this.listProductCart[this.tabDefault].reduce((total : number,current : any)=>{
        return total + current.result;
      },0)
      this.modalData[this.tabDefault].splice(id, 1);
      this.resultBill(this.tabDefault);
      localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
      localStorage.setItem('TabModal', JSON.stringify(this.modalData));
    }
  }

  statusTotal(){
    if(this.modelRadio == 1){
      this.discount = 100;
    }
  }
  limitInput(event : any) {
    if(this.modelRadio == 1 && event.target.value > 100) {
        event.target.value = 100;
        this.discount = 100;
    }else {
      this.discount = this.discount > this.priceFormModal ? this.priceFormModal : this.discount;
      event.target.value = this.discount;
    }
    this.totalMoney = this.listProductCart[this.tabDefault].reduce((total : number,current : any)=>{
      return total + current.result;
    },0)
}

  openBasicModalPrice(content: TemplateRef<any>, id: number,index : number) {
    // this.currentPrice = this.modalData[this.tabDefault][index].result;
    console.log(this.modalData[this.tabDefault][index]);
    this.priceFormModal = this.modalData[this.tabDefault][index].priceCurrent;
    this.discount = this.modalData[this.tabDefault][index].discount;
    this.tax = this.modalData[this.tabDefault][index].tax;
    this.modelRadio = this.modalData[this.tabDefault][index].radioDiscount;
    this.modalService
      .open(content, {})
      .result.then((result) => {
        // console.log(result);
        // console.log(this.priceFormModal,this.discount,this.tax);
        console.log(this.modelRadio);

        if (result) {
         
          
          let priceCurrent = null;
          if (this.modelRadio === 1) {
            const total = this.priceFormModal * Number(this.discount)
             priceCurrent =
              this.priceFormModal -
              total / 100 +
              ((this.priceFormModal -
                total / 100) *
                this.tax) /
                100;
           
          } else {
          
            const total = this.priceFormModal - Number(this.discount);
             priceCurrent =
             total +
              (total *
                this.tax) /
                100;
          }
          const objData = {
            priceCurrent : +this.priceFormModal,
            discount : this.discount,
            tax : +this.tax,
            radioDiscount :this.modelRadio,
            result : priceCurrent
          }
          console.log(objData);
          console.log(this.modalData);
          this.updateQuantity(this.listProductCart[this.tabDefault],+id,priceCurrent,'price');
          this.updateModal(this.modalData[this.tabDefault],+id,objData)
          this.totalMoney = this.listProductCart[this.tabDefault].reduce((total : number,current : any)=>{
            return total + current.result;
          },0)
          this.resultBill(this.tabDefault);
          localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
          localStorage.setItem('TabModal', JSON.stringify(this.modalData));
          // console.log(this.modalData[this.tabDefault]);
          // console.log(this.modalData);
          
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


  addProduct(item : any){
    console.log(item);
    this.listProductCart[this.tabDefault].push({...item,quanity : 1,result : 1 * item.price_export})
    console.log(this.listProductCart);
    
  }

  addProductQuality(item : any){
    Swal.fire({
      title: 'Bán vượt quá số tồn kho',
      text: 'Sản phẩm này hiện không đủ số lượng trong kho. Bạn vẫn muốn bán chứ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText : 'Quay lại',
      confirmButtonText: 'Tiếp tục bán',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(item);
        
    }
    });
  }
  

  openLgModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, { size: 'lg' })
      .result.then((result) => {
        console.log('Modal closed' + result);
      })
      .catch((res) => {});
  }

  increaseQuantity(id : number) {
    let inputValue = (<HTMLInputElement>document.getElementById(`${id}`));
    const count = 1 + Number(inputValue.value);
    this.updateQuantity(this.listProductCart[this.tabDefault],+id,count,'quanity');
    this.totalMoney = this.listProductCart[this.tabDefault].reduce((total : number,current : any)=>{
      return total + current.result;
    },0)
    this.resultBill(this.tabDefault);
    localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
  }

  decreaseQuantity(id : number) {
    let inputValue = (<HTMLInputElement>document.getElementById( `${id}`));
    if(+inputValue.value > 0){
      this.updateQuantity(this.listProductCart[this.tabDefault],+id,Number(inputValue.value)-1,'quanity');
      this.totalMoney = this.listProductCart[this.tabDefault].reduce((total : number,current : any)=>{
        return total + current.result;
      },0)
      this.resultBill(this.tabDefault);
      localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
    }
  }
  
  updateQuantity(array: any, id: number, newQuantity: any, name: string) {
    
    const typeUpdate = name === 'quanity' ? 'quanity' : 'price_export';
    const resultType = name === 'quanity' ? 'price_export' : 'quanity';
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        array[i][typeUpdate] = newQuantity;
        array[i].result = newQuantity * array[i][resultType];
        break;
      }
    }
  }

  updateModal(array: any, id: number, newQuantity: any) {
    console.log(array);
    

    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        for (const [key, value] of Object.entries(newQuantity)) {
          array[i][key] = value;
        }
        // array[i][typeUpdate] = newQuantity;
        // array[i].result = newQuantity * array[i][resultType];
        break;
      }
    }
  }

  updateBill(array: any, id: number, newQuantity: any) {
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      if (i === id) {
        for (const [key, value] of Object.entries(newQuantity)) {
          array[i][key] = value;
        }
        // array[i][typeUpdate] = newQuantity;
        // array[i].result = newQuantity * array[i][resultType];
        break;
      }
    }
  }

  showNextMessage(errorMessages : any) {
    if (errorMessages.length > 0) {
      const message = errorMessages.shift();
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Thất bại!',
        text: message,
        icon: 'error',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        didClose: () => {
          this.showNextMessage(errorMessages);
        }
      });
    }
  }
}
