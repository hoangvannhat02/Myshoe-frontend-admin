import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/myservice/toast.service';

@Component({
  selector: 'app-categoryvoucher',
  templateUrl: './categoryvoucher.component.html',
  styleUrls: ['./categoryvoucher.component.css']
})
export class CategoryvoucherComponent {
  categoryvoucherobj = {
    LoaiPhieu: "",
    GiaTri: 0,
    GiaTriNhoNhat: 0,
    GiaTriLonNhat: 0
  }
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  categoryvouchers: any;
  btn: string = "Thêm mới";
  categoryvoucher: any = {
  };

  allVouchers: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formVoucher: FormGroup

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private toastmsg:ToastService
  ) {
    this.formVoucher = this.fb.group({
      LoaiPhieu: ['', [Validators.required]],
      GiaTri: ['', [Validators.required, Validators.min(1)]],
      GiaTriNhoNhat: ['', [Validators.required, Validators.min(1)]],
      GiaTriLonNhat: ['', [Validators.required, Validators.min(1)]],
    }, { validator: this.checkGiaTri });
  };

  ngOnInit(): void {
    this.search();
  }

  checkGiaTri(group: any) {
    const giaTriNhoNhat = group.get('GiaTriNhoNhat').value;
    const giaTriLonNhat = group.get('GiaTriLonNhat').value;

    if (giaTriNhoNhat >= giaTriLonNhat) {
      group.get('GiaTriLonNhat').setErrors({ notGreaterThan: true });
      return { notGreaterThan: true }; 
    } else {
      return null; 
    }

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
    this.http.get("http://localhost:8000/admin/categoryvoucher/data").subscribe((response: any) => {
      this.allVouchers = response;
    }, (error) => {
      console.error(error);
    })
  }

  loadnew() {
    this.categoryvoucherobj.LoaiPhieu = '';
    this.categoryvoucherobj.GiaTri = 0;
    this.categoryvoucherobj.GiaTriLonNhat = 0;
    this.categoryvoucherobj.GiaTriNhoNhat = 0;
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/categoryvoucher/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.categoryvoucher.MaLoaiPhieu = response[0].MaLoaiPhieu;
        this.categoryvoucher.LoaiPhieu = response[0].LoaiPhieu;
        this.categoryvoucher.GiaTri = response[0].GiaTri;
        this.categoryvoucher.GiaTriNhoNhat = response[0].GiaTriNhoNhat;
        this.categoryvoucher.GiaTriLonNhat = response[0].GiaTriLonNhat;
      }
      console.log(this.categoryvoucher)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    this.submitted = true
    if (this.formVoucher.valid) {
      this.http.post("http://localhost:8000/admin/categoryvoucher/create", this.categoryvoucherobj).subscribe((response: any) => {
        if (response.result) {
          this.toastmsg.showToast({
            title:"Thêm thành công",
            type:"success"
          })
          this.formVoucher.reset()
          this.submitted = false
          this.loadnew()
          this.search();
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

  search() {
    this.http.post("http://localhost:8000/admin/categoryvoucher/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.categoryvouchers = response[1];
        if (this.filterobj.pagenumber > this.totalPages) {
          this.filterobj.pagenumber = this.totalPages;
          this.search();
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  onPrevious(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber--;
    this.search();
  }

  onNext(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber++;
    this.search();
  }

  edit() {
    this.http.post("http://localhost:8000/admin/categoryvoucher/update", this.categoryvoucher).subscribe((response: any) => {
      if (response.result) {
        this.toastmsg.showToast({
          title:"Cập nhật thành công",
          type:"success"
        })
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

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/categoryvoucher/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          this.toastmsg.showToast({
            title:"Xóa thành công",
            type:"success"
          })
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

  selectedAll(event: any) {
    const isChecked = event.target.checked
    this.checkedAll = isChecked
    if (isChecked) {
      this.selectedItems = [...this.allVouchers]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaLoaiPhieu === item.MaLoaiPhieu);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaLoaiPhieu != item.MaLoaiPhieu)
    }
    this.checkedAll = this.selectedItems.length === this.allVouchers.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các phần đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/categoryvoucher/delete/" + item.MaLoaiPhieu).subscribe((response: any) => {
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
