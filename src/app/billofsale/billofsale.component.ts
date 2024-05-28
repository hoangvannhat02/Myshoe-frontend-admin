import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-billofsale',
  templateUrl: './billofsale.component.html',
  styleUrls: ['./billofsale.component.css']
})
export class BillofsaleComponent {
  tenloai = '';

  status=0;
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5,
    "status":0
  }
  totalPages = 0;
  bills: any;
  mota = "";
  btn: string = "Thêm mới";
  category: any = {
  };

  constructor(
    private http: HttpClient,
    private renderer: Renderer2, 
    private el: ElementRef,
    private router:Router,
    private route: ActivatedRoute
    ) 
    { };

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const status = params['status'];
      if(status){
        this.filterobj.status = status
        this.status = status
        this.search()
      }
    })
    this.search();
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

  // getdata() {
  //   this.http.get("http://localhost:8000/admin/billofsale/data").subscribe((response: any) => {
  //     this.bills = this.bills;
  //     console.log(this.bills)
  //   }, (error) => {
  //     console.error(error);
  //   })
  // }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/billofsale/databyid/" + id).subscribe((response: any) => {
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

  search() {
    this.http.post("http://localhost:8000/admin/billofsale/search", this.filterobj).subscribe((response: any) => {   
      console.log(response);
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.bills = response[1];
        if (this.filterobj.pagenumber > this.totalPages) {
          this.filterobj.pagenumber = this.totalPages;
          this.search();
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  changene(){
    this.router.navigate([],{queryParams:{status:this.status}})
    this.filterobj.status = this.status
    this.search()
  }

  onPrevious(event:Event){
    event.preventDefault();
    this.filterobj.pagenumber --;
    this.search();
  }

  onNext(event:Event){
    event.preventDefault();
    this.filterobj.pagenumber ++;
    this.search();
  }


  redirettodetail(id:any){
    this.router.navigate(['/detailbillofsale/',id])
  }

  // delete(id: any) {
  //   if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
  //     this.http.delete("http://localhost:8000/admin/billofsale/delete/" + id).subscribe((response: any) => {
  //       if (response.result) {
  //         alert(response.message)
  //         this.getdata();
  //       }
  //       else {
  //         alert("xóa thất bại")
  //       }
  //     }, (error) => {
  //       console.error(error);
  //     })
  //   }
  // }
}
