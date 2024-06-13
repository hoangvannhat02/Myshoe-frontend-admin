import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.css']
})
export class SizesComponent {
  tenkichthuoc = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  sizes: any;
  btn: string = "Thêm mới";
  size: any = {

  };

  allSizes: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formSize: FormGroup
  constructor(
    private http: HttpClient, 
    private renderer: Renderer2, 
    private el: ElementRef,
    private fb: FormBuilder,
    private toastmsg:ToastService
  ) {
    this.formSize = this.fb.group({
      tenkichthuoc: ['', [Validators.required, Validators.minLength(1)]],
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
    this.http.get("http://localhost:8000/admin/size/data").subscribe((response: any) => {
      this.allSizes = response;
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/size/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.size.MaKichThuoc = response[0].MaKichThuoc;
        this.size.TenKichThuoc = response[0].TenKichThuoc;
      }
      console.log(this.size)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    this.submitted = true
    if (this.formSize.valid) {
      let obj: any = {
        TenKichThuoc: this.tenkichthuoc
      }
      this.http.post("http://localhost:8000/admin/size/create", obj).subscribe((response: any) => {
        if (response.result) {
          this.tenkichthuoc = ""
          this.formSize.reset()
          this.submitted = false
          this.toastmsg.showToast({
            title:"Thêm thành công",
            type:"success"
          })
          this.tenkichthuoc = '';
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
    this.http.post("http://localhost:8000/admin/size/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.sizes = response[1];
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
    this.http.post("http://localhost:8000/admin/size/update", this.size).subscribe((response: any) => {
      if (response.result) {
        this.toastmsg.showToast({
          title:"Cập nhật thành công",
          type:"success"
        })
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

  delete(id: any) {
    if (confirm("Bạn có muốn xóa kích thước này không?")) {
      this.http.delete("http://localhost:8000/admin/size/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          this.toastmsg.showToast({
            title:"Xóa thành công",
            type:"success"
          })
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

  selectedAll(event: any) {
    const isChecked = event.target.checked
    this.checkedAll = isChecked
    if (isChecked) {
      this.selectedItems = [...this.allSizes]
      console.log(this.selectedItems);

    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaKichThuoc === item.MaKichThuoc);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaKichThuoc != item.MaKichThuoc)
    }
    this.checkedAll = this.selectedItems.length === this.sizes.allSizes
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các màu đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/size/delete/" + item.MaKichThuoc).subscribe((response: any) => {
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
