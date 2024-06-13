import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent {
  tenvanchuyen = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  transports: any;
  gia = 0;
  btn: string = "Thêm mới";
  transport: any = {
  };

  allTransports: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formTransport: FormGroup

  constructor(
    private http: HttpClient,
    private renderer: Renderer2, 
    private el: ElementRef,
    private fb: FormBuilder,
    private toastmsg:ToastService
  ) { 
    this.formTransport = this.fb.group({
      tenvanchuyen: ['', [Validators.required]],
      gia: ['', [Validators.required,Validators.min(1)]],
    });
  };

  ngOnInit(): void {
    this.search();
    this.getdata()
  }
  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  handleNavbarClick() {
    const menuListElement = document.querySelector('.navbar_content');
    let classNavRight = menuListElement?.parentElement?.parentElement?.parentElement;
    let classNavLeft = menuListElement?.parentElement?.parentElement?.parentElement?.previousElementSibling;
    if (classNavRight) {
      // Toggle classNavRight
      classNavRight.className = classNavRight.className === "col c-12 m-12 l-12 content_nav_hiddened" ? "col c-12 m-9 l-9" : "col c-12 m-12 l-12 content_nav_hiddened";
      // Toggle classNavLeft
      if (classNavLeft) {
        if ((classNavLeft as HTMLElement).style.display === "none") {
          (classNavLeft as HTMLElement).style.display = "block";
        } else {
          (classNavLeft as HTMLElement).style.display = "none";
        }
      }
    }
  }

  getdata() {
    this.http.get("http://localhost:8000/admin/transport/data").subscribe((response: any) => {
      this.allTransports = response;
    }, (error) => {
      console.error(error);
    })
  }

  loadnew(){
    this.tenvanchuyen = '';
    this.gia = 0;
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/transport/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.transport.MaVanChuyen = response[0].MaVanChuyen;
        this.transport.TenVanChuyen = response[0].TenVanChuyen;
        this.transport.Gia = response[0].Gia;
      }
      console.log(this.transport)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    this.submitted = true
    if (this.formTransport.valid) {
    let obj: any = {
      TenVanChuyen: this.tenvanchuyen,
      Gia: this.gia
    }
    this.http.post("http://localhost:8000/admin/transport/create", obj).subscribe((response: any) => {
      if (response.result) {
        this.toastmsg.showToast({
          title:"Thêm thành công",
          type:"success"
        })
        this.loadnew()
        this.formTransport.reset()
        this.submitted = false
        this.search();
      }
      else {
        this.toastmsg.showToast({
          title:"Có lỗi",
          type:"error"
        })
      }
    }, (error) => {
      console.error(error);

    })
  }
  }

  search() {
    this.http.post("http://localhost:8000/admin/transport/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.transports = response[1];
        if (this.filterobj.pagenumber > this.totalPages) {
          this.filterobj.pagenumber = this.totalPages;
          this.search();
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  onPrevious(event:Event){
    event.preventDefault();
    this.filterobj.pagenumber --;
    this.search();
  }

  onNext(event:Event){
    event.preventDefault();
    this.filterobj.pagenumber ++;
    this.search();
  }

  edit() {

    this.http.post("http://localhost:8000/admin/transport/update", this.transport).subscribe((response: any) => {      
      if (response.result) {
        this.toastmsg.showToast({
          title:"Cập nhật thành công",
          type:"success"
        })
        this.getdata();
      }
      else {
        this.toastmsg.showToast({
          title:"Có lỗi",
          type:"error"
        })
      }
    }, (error) => {
      console.error(error);

    })
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/transport/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          this.toastmsg.showToast({
            title:"Xóa thành công",
            type:"success"
          })
          this.getdata();
        }
        else {
          this.toastmsg.showToast({
            title:"Có lỗi",
            type:"error"
          })
        }
      }, (error) => {
        console.error(error);
      })
    }
  }
  selectedAll(event: any) {
    const isChecked = event.target.checked
    this.checkedAll = isChecked
    if (isChecked) {
      this.selectedItems = [...this.allTransports]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaVanChuyen === item.MaVanChuyen);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaVanChuyen != item.MaVanChuyen)
    }
    this.checkedAll = this.selectedItems.length === this.allTransports.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các phần đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/transport/delete/" + item.MaVanChuyen).subscribe((response: any) => {
          if (response.result) {
            this.search();
          }
        }, (error) => {
          console.error(error);
        })
      })
      this.selectedItems = []
    }
  }
}
