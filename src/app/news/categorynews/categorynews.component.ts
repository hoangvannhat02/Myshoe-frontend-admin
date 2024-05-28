import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categorynews',
  templateUrl: './categorynews.component.html',
  styleUrls: ['./categorynews.component.css']
})
export class CategorynewsComponent {
  tenchude = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  categorynews: any;
  btn: string = "Thêm mới";
  categorynew: any = {
  };

  allCategorynews: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formCategorynew: FormGroup
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder
  ) {
    this.formCategorynew = this.fb.group({
      tenchude: ['', [Validators.required]],
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

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdata() {
    this.http.get("http://localhost:8000/admin/categorynews/data").subscribe((response: any) => {
      this.allCategorynews = response;
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/categorynews/databyid/" + id).subscribe((response: any) => {
      console.log(response);

      if (response) {
        this.categorynew.MaChuDeTinTuc = response[0].MaChuDeTintuc;
        this.categorynew.TenChuDe = response[0].TenChuDe;
      }
      console.log(this.categorynew)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    this.submitted = true
    if (this.formCategorynew.valid) {
      let obj: any = {
        TenChuDe: this.tenchude
      }
      this.http.post("http://localhost:8000/admin/categorynews/create", obj).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
          this.tenchude = '';
          this.formCategorynew.reset()
        this.submitted = false
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
    this.http.post("http://localhost:8000/admin/categorynews/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.categorynews = response[1];
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
    this.http.post("http://localhost:8000/admin/categorynews/update", this.categorynew).subscribe((response: any) => {
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
    if (confirm("Bạn có muốn xóa chủ đề này không?")) {
      this.http.delete("http://localhost:8000/admin/categorynews/delete/" + id).subscribe((response: any) => {
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
      this.selectedItems = [...this.allCategorynews]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaChuDeTintuc === item.MaChuDeTintuc);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    
    if (ischecked) {
      this.selectedItems.push(item)
      
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaChuDeTintuc != item.MaChuDeTintuc)
    }
    this.checkedAll = this.selectedItems.length === this.allCategorynews.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các phần đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/categorynews/delete/" + item.MaChuDeTintuc).subscribe((response: any) => {
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
