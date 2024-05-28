import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent {
  public Editor = Editor;

  tenhang = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  brands: any;
  mota = "";
  btn: string = "Thêm mới";
  brand: any = {

  };

  allBrands:any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formBrand: FormGroup

  constructor(private http: HttpClient, private renderer: Renderer2, private el: ElementRef,
    private fb: FormBuilder,
  ) {
    this.formBrand = this.fb.group({
      tenhang: ['', [Validators.required, Validators.minLength(1)]],
      mota: ['', [Validators.required, Validators.minLength(1)]]
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

  getdata() {
    this.http.get("http://localhost:8000/admin/brand/data").subscribe((response: any) => {
      this.allBrands = response;
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/brand/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.brand.MaHang = response[0].MaHang;
        this.brand.TenHang = response[0].TenHang;
        this.brand.MoTa = response[0].MoTa;
      }
      console.log(this.brand)
    }, (error) => {
      console.error(error);

    })
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

  add() {
    this.submitted = true
    if (this.formBrand.valid) {
      let obj: any = {
        TenHang: this.tenhang,
        MoTa: this.mota
      }
      this.http.post("http://localhost:8000/admin/brand/create", obj).subscribe((response: any) => {
        if (response.result) {
          this.mota = ""
          this.tenhang = ""
          this.formBrand.reset()
          this.submitted = false
          alert(response.message)
          this.search();
        }
        else {
          alert("thêm thất bại")
        }
      }, (error) => {
        console.error(error);

      })
    }
  }

  search() {
    this.http.post("http://localhost:8000/admin/brand/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.brands = response[1];
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
    this.http.post("http://localhost:8000/admin/brand/update", this.brand).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.search();
      }
      else {
        alert("sửa thất bại")
      }
    }, (error) => {
      console.error(error);

    })
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa hãng này không?")) {
      this.http.delete("http://localhost:8000/admin/brand/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
          this.search();
        }
        else {
          alert("xóa thất bại")
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
      this.selectedItems = [...this.allBrands]      
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaHang === item.MaHang);
  }

  checkedItem(event: any, item: any) {    
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaHang != item.MaHang)
    }
    this.checkedAll = this.selectedItems.length === this.allBrands.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các sản phẩm đã chọn này không?")) {
      this.selectedItems.forEach((item)=>{
        this.http.delete("http://localhost:8000/admin/brand/delete/" + item.MaHang).subscribe((response: any) => {
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
