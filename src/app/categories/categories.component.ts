import { Component, ElementRef, Injectable, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  public Editor = Editor;

  tenloai = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  categories: any;
  mota = "";
  btn: string = "Thêm mới";
  category: any = {
  };
  
  allcategories: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formCategory: FormGroup

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private el: ElementRef,
    private toastmsg:ToastService
  ) {
    this.formCategory = this.fb.group({
      tenloai: ['', [Validators.required, Validators.minLength(1)]],
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
    this.http.get("http://localhost:8000/admin/category/data").subscribe((response: any) => {
      this.allcategories = response;
      console.log(this.allcategories)
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/category/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.category.MaLoai = response[0].MaLoai;
        this.category.TenLoai = response[0].TenLoai;
        this.category.MoTa = response[0].MoTa;
      }
      console.log(this.category)
    }, (error) => {
      console.error(error);

    })
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

  add() {
    this.submitted = true
    if (this.formCategory.valid) {
      let obj: any = {
        TenLoai: this.tenloai,
        MoTa: this.mota
      }
      this.http.post("http://localhost:8000/admin/category/create", obj).subscribe((response: any) => {
        if (response.result) {
          this.mota = ""
          this.tenloai = ""
          this.formCategory.reset()
          this.submitted = false
          this.search();
          this.toastmsg.showToast({
            title:"Thêm thành công",
            type:"success"
          })
          // alert(response.message)
        }
        else {
          this.toastmsg.showToast({
            title:"Lỗi",
            type:"warning"
          })
        }
      }, (error) => {
        console.error(error);

      })
    }
  }

  search() {
    this.http.post("http://localhost:8000/admin/category/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.categories = response[1];
        if (this.filterobj.pagenumber > this.totalPages) {
          this.filterobj.pagenumber = this.totalPages;
          this.search();
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  onPage(event: any) {
    event.preventDefault()
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
    this.http.post("http://localhost:8000/admin/category/update", this.category).subscribe((response: any) => {
      if (response.result) {
        this.toastmsg.showToast({
          title:"Cập nhật thành công",
          type:"success"
        })
        // alert(response.message)
        this.search();
      }
      else {
        this.toastmsg.showToast({
          title:"Lỗi",
          type:"warning"
        })
      }
    }, (error) => {
      console.error(error);

    })
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/category/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          this.toastmsg.showToast({
            title:response.message,
            type:"success"
          })
          this.search();
        }
        else {
          this.toastmsg.showToast({
            title:"Lỗi",
            type:"warning"
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
      this.selectedItems = [...this.allcategories]      
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaLoai === item.MaLoai);
  }

  checkedItem(event: any, item: any) {    
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaLoai != item.MaLoai)
    }
    this.checkedAll = this.selectedItems.length === this.allcategories.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các sản phẩm đã chọn này không?")) {
      this.selectedItems.forEach((item)=>{
        this.http.delete("http://localhost:8000/admin/category/delete/" + item.MaLoai).subscribe((response: any) => {
          if (response.result) {
            this.toastmsg.showToast({
              title:"Đã xóa",
              type:"success"
            })
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
