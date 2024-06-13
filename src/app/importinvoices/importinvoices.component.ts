import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-importinvoices',
  templateUrl: './importinvoices.component.html',
  styleUrls: ['./importinvoices.component.css']
})
export class ImportinvoicesComponent {
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  importinvoices: any;
  importinvoice: any = {
    MaNhaCungCap: 0,
    MaNguoiDung: 0,
    NgayNhap: ""

  };
  importinvoiceobj: any = {
    MaHoaDonNhap: 0,
    MaNhaCungCap: 0,
    MaNguoiDung: 0,
    NgayNhap: ""
  };
  users: any;
  suppliers: any;

  allImportinvoices: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formImportinvoice: FormGroup
  constructor(
    private http: HttpClient,
    private datePiPe: DatePipe,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private toastmsg:ToastService
  ) {
    this.formImportinvoice = this.fb.group({
      MaNhaCungCap: [0, [Validators.required, Validators.min(1)]],
      MaNguoiDung: [0, [Validators.required, Validators.min(1)]],
      NgayNhap: [new Date(), [Validators.required]],
    });
  };

  ngOnInit(): void {
    this.getdata();
    this.getdatasuppliers();
    this.getdatausers();
    this.getAllData()
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

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/importinvoice/databyid/" + id).subscribe((response: any) => {
      console.log(response);

      if (response) {
        this.importinvoiceobj.MaHoaDonNhap = response[0].MaHoaDonNhap;
        this.importinvoiceobj.MaNguoiDung = response[0].MaNguoiDung;
        this.importinvoiceobj.MaNhaCungCap = response[0].MaNhaCungCap;
        const formattedDate = this.datePiPe.transform(new Date(response[0].NgayNhap), 'yyyy-MM-dd');
        this.importinvoiceobj.NgayNhap = formattedDate;

      }
    }, (error) => {
      console.error(error);
    })
  }

  getAllData() {
    this.http.get("http://localhost:8000/admin/importinvoice/data").subscribe((response: any) => {
      if (response) {
        this.allImportinvoices = response;
      }
    }, (error) => {
      console.error(error);
    })
  }

  add() {
    this.submitted = true
    if (this.formImportinvoice.valid) {
      const formattedDate = this.datePiPe.transform(new Date(this.importinvoice.NgayNhap), 'yyyy-MM-dd');
      this.importinvoice.NgayNhap = formattedDate;
      this.http.post("http://localhost:8000/admin/importinvoice/create", this.importinvoice).subscribe((response: any) => {
        if (response.result) {
          this.getdata();
          this.loadNew();
          this.formImportinvoice.reset()
          this.submitted = false
          this.toastmsg.showToast({
            title:"Thêm thành công",
            type:"success"
          })
        }
        else {
          console.log(response.message);
          this.toastmsg.showToast({
            title:"Lỗi",
            type:"error"
          })
        }
      }, (error) => {
        console.error(error);

      })
    }
  }


  getdata() {
    this.http.post("http://localhost:8000/admin/importinvoice/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.importinvoices = response[1];
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
    this.importinvoice = {
      MaNhaCungCap: 0,
      MaNguoiDung: 0,
      NgayNhap: ""
    };
    this.formImportinvoice.reset()
    this.submitted = false
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
    const formattedDate = this.datePiPe.transform(new Date(this.importinvoiceobj.NgayNhap), 'yyyy-MM-dd');
    this.importinvoiceobj.NgayNhap = formattedDate;

    this.http.post("http://localhost:8000/admin/importinvoice/update", this.importinvoiceobj).subscribe((response: any) => {

      if (response.result) {
        this.toastmsg.showToast({
          title:"Cập nhật thành công",
          type:"success"
        })
        this.getdata();
      }
      else {
        this.toastmsg.showToast({
          title:"Lỗi",
          type:"error"
        })
      }
    }, (error) => {
      console.error(error);

    })
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa thông tin này không?")) {
      this.http.delete("http://localhost:8000/admin/importinvoice/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          this.toastmsg.showToast({
            title:"Thêm thành công",
            type:"success"
          })
          this.getdata();
        }
        else {
          this.toastmsg.showToast({
            title:"Lỗi",
            type:"error"
          })
        }
      }, (error) => {
        console.error(error);
      })
    }
  }
  getdatausers() {
    this.http.get("http://localhost:8000/admin/user/data").subscribe((response: any) => {
      this.users = response;
    }, (error) => {
      console.error(error);
    })
  }
  getdatasuppliers() {
    this.http.get("http://localhost:8000/admin/supplier/data").subscribe((response: any) => {
      this.suppliers = response;
    }, (error) => {
      console.error(error);
    })
  }

  redirettodetail(id: any) {
    this.router.navigate(['detailimportinvoice/' + id])
  }

  selectedAll(event: any) {
    const isChecked = event.target.checked
    this.checkedAll = isChecked
    if (isChecked) {
      this.selectedItems = [...this.allImportinvoices]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaHoaDonNhap === item.MaHoaDonNhap);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaHoaDonNhap != item.MaHoaDonNhap)
    }
    this.checkedAll = this.selectedItems.length === this.allImportinvoices.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các phần đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/importinvoice/delete/" + item.MaHoaDonNhap).subscribe((response: any) => {
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
