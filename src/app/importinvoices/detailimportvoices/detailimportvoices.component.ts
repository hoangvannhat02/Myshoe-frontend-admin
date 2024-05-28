import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detailimportvoices',
  templateUrl: './detailimportvoices.component.html',
  styleUrls: ['./detailimportvoices.component.css']
})
export class DetailimportvoicesComponent {
  id: any;
  searchkeyword: any;
  detailimportinvoices: any;
  detailimportinvoice: any = {
    MaHoaDonNhap: 0,
    MaChiTietSanPham: 0,
    GiaNhap: 0,
    SoLuong: 0
  };
  detailimportinvoiceobj: any = {
    MaChiTietHoaDonNhap: 0,
    MaHoaDonNhap: 0,
    MaChiTietSanPham: 0,
    GiaNhap: 0,
    SoLuong: 0
  };
  products: any;

  allCategoryImportinvoices: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formCategoryImportinvoice: FormGroup
  constructor(
    private http: HttpClient, 
    private datePiPe: DatePipe, 
    private route: ActivatedRoute,
    private renderer: Renderer2, 
    private el: ElementRef,
    private fb: FormBuilder
  ) {
    this.formCategoryImportinvoice = this.fb.group({
      MaChiTietSanPham: [0, [Validators.required, Validators.min(1)]],
      GiaNhap: [0, [Validators.required, Validators.min(1)]],
      SoLuong: [new Date(), [Validators.required,Validators.min(1)]],
    });
   };

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.detailimportinvoice.MaHoaDonNhap = this.id;
    this.getdata();
    this.getdataproducts();
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
    this.http.get("http://localhost:8000/admin/detailimportinvoice/dataid/" + id).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.detailimportinvoiceobj.MaHoaDonNhap = response[0].MaHoaDonNhap;
        this.detailimportinvoiceobj.MaChiTietSanPham = response[0].MaChiTietSanPham;
        this.detailimportinvoiceobj.MaChiTietHoaDonNhap = response[0].MaChiTietHoadonNhap;
        this.detailimportinvoiceobj.GiaNhap = response[0].GiaNhap;
        this.detailimportinvoiceobj.SoLuong = response[0].SoLuong;
      }
    }, (error) => {
      console.error(error);
    })
  }

  add() {
    this.submitted = true
    if (this.formCategoryImportinvoice.valid) {
    let isMatch = this.detailimportinvoices.find((data: any) => {
      return data.MaChiTietSanPham.toString() === this.detailimportinvoice.MaChiTietSanPham.toString();
    });
    if (isMatch) {
      alert("Thông tin sản phẩm đã có trong đây vui lòng xem lại và chỉ cần cập nhật lại số lượng")
    }
    else {
      this.http.post("http://localhost:8000/admin/detailimportinvoice/create", this.detailimportinvoice).subscribe((response: any) => {
        if (response.result) {
          this.getdata();
          this.loadNew();
          this.formCategoryImportinvoice.reset()
          this.submitted = false
          alert(response.message)
        }
        else {
          console.log(response.message);
          alert("thêm thất bại")
        }
      }, (error) => {
        console.error(error);

      })
    }
  }
  }


  getdata() {
    this.http.get("http://localhost:8000/admin/detailimportinvoice/databyid/" + this.id).subscribe((response: any) => {
      if (response) {
        this.detailimportinvoices = response;
      }
      else
      {
        this.detailimportinvoices = []
      }
    }, (error) => {
      console.error(error);
    })
  }

  search(){
    var lowercaseKeyword = this.searchkeyword.toLowerCase();
    if(this.searchkeyword != ""){
      var searchData = this.detailimportinvoices.filter((item:any) => item.TenSanPham.toLowerCase().includes(lowercaseKeyword) 
      || (item.MaChiTietSanPham && typeof item.MaChiTietSanPham === 'string' && item.MaChiTietSanPham.toLowerCase().includes(lowercaseKeyword))
      || item.TenMau.toLowerCase().includes(lowercaseKeyword) 
      || item.TenKichThuoc.toLowerCase().includes(lowercaseKeyword) 
      || (typeof item.GiaNhap === 'number' && item.GiaNhap.toString().toLowerCase().includes(lowercaseKeyword))
      || (typeof item.SoLuong === 'number' && item.SoLuong.toString().toLowerCase().includes(lowercaseKeyword)))
      this.detailimportinvoices = searchData
    }else{
      this.getdata()
    }
  }

  loadNew() {
    this.detailimportinvoice.MaChiTietSanPham = 0
    this.detailimportinvoice.GiaNhap = 0
    this.detailimportinvoice.SoLuong = 0
  }

  edit() {
    this.http.post("http://localhost:8000/admin/detailimportinvoice/update", this.detailimportinvoiceobj).subscribe((response: any) => {
      console.log(response);

      if (response.result) {
        alert(response.message)
        this.getdata();
      }
      else {
        alert("sửa thất bại")
      }
    }, (error) => {
      console.error(error);

    })
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa thông tin này không?")) {
      this.http.delete("http://localhost:8000/admin/detailimportinvoice/delete/" + id).subscribe((response: any) => {
        console.log(response);

        if (response.result) {
          alert(response.message)
          this.getdata();
        }
        else {
          alert("xóa thất bại")
        }
      }, (error) => {
        console.error(error);
      })
    }
  }
  getdataproducts() {
    this.http.get("http://localhost:8000/admin/detailproduct/data").subscribe((response: any) => {
      this.products = response;
      console.log(this.products);
    }, (error) => {
      console.error(error);
    })
  }


  redirettodetail(id: any) {
    this.http.get("http://localhost:8000/admin/detailimportinvoice/databyid/" + id).subscribe((response: any) => {
      console.log(response);
    }, (error) => {
      console.error(error);
    })
  }

  selectedAll(event: any) {
    const isChecked = event.target.checked
    this.checkedAll = isChecked
    if (isChecked) {
      this.selectedItems = [...this.detailimportinvoices]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaChiTietHoadonNhap === item.MaChiTietHoadonNhap);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    console.log(event.target);
    
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaChiTietHoadonNhap != item.MaChiTietHoadonNhap)
    }
    this.checkedAll = this.selectedItems.length === this.detailimportinvoices.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các phần đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/detailimportinvoice/delete/" + item.MaChiTietHoadonNhap).subscribe((response: any) => {
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
