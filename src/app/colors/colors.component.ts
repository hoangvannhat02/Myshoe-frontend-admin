import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent {
  tenmau = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  colors: any;
  btn: string = "Thêm mới";
  color: any = {

  };

  allColors:any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formColor: FormGroup

  constructor(private http: HttpClient, private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private toastmsg:ToastService
  ) {
    this.formColor = this.fb.group({
      tenmau: ['', [Validators.required, Validators.minLength(1)]],
    });
  };

  ngOnInit(): void {
    this.search();
    this.getdata()
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

  getdata() {
    this.http.get("http://localhost:8000/admin/color/data").subscribe((response: any) => {
      this.allColors = response;
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/color/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.color.MaMau = response[0].MaMau;
        this.color.TenMau = response[0].TenMau;
      }
      console.log(this.color)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    this.submitted = true
    if (this.formColor.valid) {
      let obj: any = {
        TenMau: this.tenmau
      }
      this.http.post("http://localhost:8000/admin/color/create", obj).subscribe((response: any) => {
        if (response.result) {
          this.tenmau = ""
          this.formColor.reset()
          this.submitted = false
          this.toastmsg.showToast({
            title:"Thêm thành công",
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

  search() {
    this.http.post("http://localhost:8000/admin/color/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.colors = response[1];
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
    this.http.post("http://localhost:8000/admin/color/update", this.color).subscribe((response: any) => {
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
    if (confirm("Bạn có muốn xóa màu này không?")) {
      this.http.delete("http://localhost:8000/admin/color/delete/" + id).subscribe((response: any) => {
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
      this.selectedItems = [...this.allColors]
      console.log(this.selectedItems);
      
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaMau === item.MaMau);
  }

  checkedItem(event: any, item: any) {    
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaMau != item.MaMau)
    }
    this.checkedAll = this.selectedItems.length === this.allColors.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các màu đã chọn này không?")) {
      this.selectedItems.forEach((item)=>{
        this.http.delete("http://localhost:8000/admin/color/delete/" + item.MaMau).subscribe((response: any) => {
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
