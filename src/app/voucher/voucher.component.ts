import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { min } from 'rxjs';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})

export class VoucherComponent {
  voucherobj: any = {
    MaPhieu: "",
    TenPhieu: "",
    MaLoaiPhieu: 0,
    SoLuong: 0,
    SoLuongDaDung: 0,
    NgayBatDau: "",
    NgayKetThuc: ""
  }
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  categoryvouchers: any;
  totalPages = 0;
  vouchers: any;
  btn: string = "Thêm mới";
  voucher: any = {
  };

  allVouchers: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formVoucher: FormGroup

  constructor(
    private http: HttpClient,
    private datePiPe: DatePipe,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private toastmsg: ToastService
  ) {
    this.formVoucher = this.fb.group({
      TenPhieu: ['', [Validators.required]],
      MaLoaiPhieu: [0, [Validators.required,Validators.min(1)]],
      SoLuong: [0, [Validators.required,Validators.min(1)]],
      NgayBatDau: [new Date(), [Validators.required, Validators.min(1)]],
      NgayKetThuc: [new Date(), [Validators.required, Validators.min(1)]]
    },{validator:this.endDateValidator.bind(this)});
  };

  ngOnInit(): void {
    this.search();
    this.getDataCategoryVoucher();
    this.getData()
  }

  endDateValidator(control: any) {
    const startDate = control.get('NgayBatDau').value;
    const endDate = control.get('NgayKetThuc').value;
  
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);      
      if (endDateObj.getTime() < startDateObj.getTime()) {
        control.get('NgayKetThuc').setErrors({ endDateBeforeStartDate: true });
        return { endDateBeforeStartDate: true };
      }
      else{
        return null
      }
    }
    return null;
  }

  getDataCategoryVoucher() {
    this.http.get("http://localhost:8000/admin/categoryvoucher/data").subscribe((response: any) => {
      this.categoryvouchers = response;
    }, (error) => {
      console.error(error);
    })
  }

  getData() {
    this.http.get("http://localhost:8000/admin/voucher/data").subscribe((response: any) => {
      this.allVouchers = response;
    }, (error) => {
      console.error(error);
    })
  }

  loadnew() {
    this.voucherobj.TenPhieu = '';
    this.voucherobj.MaLoaiPhieu = 0;
    this.voucherobj.SoLuong = 0;
    this.voucherobj.SoLuongDaDung = 0;
    this.voucherobj.NgayBatDau = "";
    this.voucherobj.NgayKetThuc = '';
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

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/voucher/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.voucher.MaPhieu = response[0].MaPhieu;
        this.voucher.TenPhieu = response[0].TenPhieu;
        this.voucher.SoLuong = response[0].SoLuong;
        this.voucher.MaLoaiPhieu = response[0].MaLoaiPhieu;
        this.voucher.SoLuongDaDung = response[0].SoLuongDaDung;
        const formattedDateStart = this.datePiPe.transform(new Date(response[0].NgayBatDau), 'yyyy-MM-dd');
        const formattedDateEnd = this.datePiPe.transform(new Date(response[0].NgayKetThuc), 'yyyy-MM-dd');
        this.voucher.NgayBatDau = formattedDateStart;
        this.voucher.NgayKetThuc = formattedDateEnd;
      }
      console.log(this.voucher)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    this.submitted = true
    if (this.formVoucher.valid) {
      const formattedDateStart = this.datePiPe.transform(new Date(this.voucherobj.NgayBatDau), 'yyyy-MM-dd');
      const formattedDateEnd = this.datePiPe.transform(new Date(this.voucherobj.NgayKetThuc), 'yyyy-MM-dd');
      this.voucherobj.NgayBatDau = formattedDateStart;
      this.voucherobj.NgayKetThuc = formattedDateEnd;
      this.http.post("http://localhost:8000/admin/voucher/create", this.voucherobj).subscribe((response: any) => {
        console.log(response);

        if (response.result) {
          this.toastmsg.showToast({
            title:"Thêm thành công",
            type:"success"
          })
          this.formVoucher.reset()
          this.submitted = false
          this.loadnew();
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
    this.http.post("http://localhost:8000/admin/voucher/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.vouchers = response[1];
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
  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  onNext(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber++;
    this.search();
  }

  edit() {
    const formattedDateStart = this.datePiPe.transform(new Date(this.voucher.NgayBatDau), 'yyyy-MM-dd');
    const formattedDateEnd = this.datePiPe.transform(new Date(this.voucher.NgayKetThuc), 'yyyy-MM-dd');
    this.voucher.NgayBatDau = formattedDateStart;
    this.voucher.NgayKetThuc = formattedDateEnd;

    this.http.post("http://localhost:8000/admin/voucher/update", this.voucher).subscribe((response: any) => {
      console.log(response);

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
      this.http.delete("http://localhost:8000/admin/voucher/delete/" + id).subscribe((response: any) => {
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
    return this.selectedItems.some(selectedItem => selectedItem.MaPhieu === item.MaPhieu);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaPhieu != item.MaPhieu)
    }
    this.checkedAll = this.selectedItems.length === this.allVouchers.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các phần đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/voucher/delete/" + item.MaPhieu).subscribe((response: any) => {
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
