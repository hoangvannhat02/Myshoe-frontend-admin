import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent {
  currentImg: any;
  selectedFile: any;
  imageSrc: any;
  imageEditSrc: any;
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  suppliers: any;
  supplier: any = {
    HoTen: "",
    DiaChi: "",
    Email: "",
    DienThoai: ""
  };
  supplierobj: any = {
    MaNhaCungCap: "",
    HoTen: "",
    DiaChi: "",
    Email: "",
    DienThoai: ""
  };

  allSuppliers: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formSupplier: FormGroup

  constructor(
    private http: HttpClient, 
    private toastmsg:ToastService,
    private renderer: Renderer2, 
    private el: ElementRef,
    private fb: FormBuilder
  ) {
    this.formSupplier = this.fb.group({
      HoTen: ['', [Validators.required, Validators.minLength(1)]],
      DiaChi: ['', [Validators.required, Validators.minLength(1)]],
      Email: ['', [Validators.required, Validators.email]],
      DienThoai: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10),Validators.pattern('^[0-9]*$')]],
    });
  };

  ngOnInit(): void {
    this.getdata();
    this.getall()
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
      classNavRight.className = classNavRight.className === "col c-12 m-12 l-12 content_nav_hiddened" ? "col c-12 m-9 l-9" : "col c-12 m-12 l-12 content_nav_hiddened";
      if (classNavLeft) {
        if ((classNavLeft as HTMLElement).style.display === "none") {
          (classNavLeft as HTMLElement).style.display = "block";
        } else {
          (classNavLeft as HTMLElement).style.display = "none";
        }
      }
    }
  }

  getall() {
    this.http.get("http://localhost:8000/admin/supplier/data").subscribe((response: any) => {
      if (response) {
        this.allSuppliers = response
      }
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/supplier/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.supplierobj.MaNhaCungCap = response[0].MaNhaCungCap;
        this.supplierobj.HoTen = response[0].HoTen;
        this.supplierobj.DiaChi = response[0].DiaChi;
        this.supplierobj.Email = response[0].Email;
        this.supplierobj.DienThoai = response[0].DienThoai;
      }
    }, (error) => {
      console.error(error);
    })
  }

  add() {
    this.submitted = true
    if (this.formSupplier.valid) {

      this.http.post("http://localhost:8000/admin/supplier/create", this.supplier).subscribe((response: any) => {
        if (response.result) {
          this.loadNew()
          this.formSupplier.reset()
          this.submitted = false
          this.getdata();
          this.toastmsg.showToast({
            title:"Thêm thành công",
            type:"success"
          })
        }
        else {
          console.log(response.message);
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


  getdata() {
    this.http.post("http://localhost:8000/admin/supplier/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.suppliers = response[1];
        if (this.filterobj.pagenumber > this.totalPages) {
          this.filterobj.pagenumber = this.totalPages;
          this.getdata();
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  loadNew() {
    this.supplier = {};
  }

  onPrevious(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber--;
    this.getdata();
  }

  onNext(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber++;
    this.getdata();
  }

  edit() {
    this.http.post("http://localhost:8000/admin/supplier/update", this.supplierobj).subscribe((response: any) => {
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
    if (confirm("Bạn có muốn xóa thông tin này không?")) {
      this.http.delete("http://localhost:8000/admin/supplier/delete/" + id).subscribe((response: any) => {
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
      this.selectedItems = [...this.allSuppliers]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaNhaCungCap === item.MaNhaCungCap);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaNhaCungCap != item.MaNhaCungCap)
    }
    this.checkedAll = this.selectedItems.length === this.allSuppliers.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các màu đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/supplier/delete/" + item.MaNhaCungCap).subscribe((response: any) => {
          if (response.result) {
            this.getdata();
          }
        }, (error) => {
          console.error(error);
        })
      })
      this.selectedItems = []
    }
  }
}
