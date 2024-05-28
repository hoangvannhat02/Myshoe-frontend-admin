import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Injectable, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent {
  public Editor = Editor;

  totalPages:number = 0;
  productobj = {
    "MaSanPham":0,
    "TenSanPham":"",
    "MaLoai":0,
    "MaHang":0,
    "LuotXem":0,
    "TrangThai":1,
    "MoTaNgan":"",
    "MoTa":"" 
  }
  loaisanpham:any;
  hang:any;
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  categories:any;
  brands:any;
  products:any;
  product: any = {
    "MaSanPham":0,
    "TenSanPham":"",
    "MaLoai":0,
    "MaHang":0,
    "LuotXem":0,
    "TrangThai":1,
    "MoTaNgan": "",
    "MoTa": ""
  };

  allProducts: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formProduct: FormGroup

  constructor(
    private http: HttpClient,
    private route:Router,
    private renderer: Renderer2, 
    private el: ElementRef,
    private fb:FormBuilder
  ){
    this.formProduct = this.fb.group({
      TenSanPham: ['', [Validators.required]],
      MaLoai: [0, [Validators.required, Validators.min(1)]],
      MaHang: [0, [Validators.required, Validators.min(1)]],
      MoTaNgan:['',Validators.required],
      MoTa:['',Validators.required]
    });
  };
  ngOnInit(): void {    
    this.search();
    this.getdatacate();
    this.getdatabrand();
    this.getAllData()
  }

  loadnew(){
    this.productobj.MaSanPham = 0,
    this.productobj.TenSanPham = "",
    this.productobj.MaLoai = 0,
    this.productobj.MaHang = 0,
    this.productobj.LuotXem = 0,
    this.productobj.TrangThai = 1,
    this.productobj.MoTaNgan = "",
    this.productobj.MoTa = "" 
    this.formProduct.reset()
    this.submitted = false
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

  getdatacate() {
    this.http.get("http://localhost:8000/admin/category/data").subscribe((response: any) => {
      this.categories = response;
      console.log(this.categories)
    }, (error) => {
      console.error(error);
    })
  }

  getAllData() {
    this.http.get("http://localhost:8000/admin/product/data").subscribe((response: any) => {
      this.allProducts = response;
    }, (error) => {
      console.error(error);
    })
  }

  getdatabrand() {
    this.http.get("http://localhost:8000/admin/brand/data").subscribe((response: any) => {
      this.brands = response;
      console.log(this.brands)
    }, (error) => {
      console.error(error);
    })
  }

  search() {
    this.http.post("http://localhost:8000/admin/product/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.products = response[1];
        if (this.filterobj.pagenumber > this.totalPages) {
          this.filterobj.pagenumber = this.totalPages;
          this.search();
        }
      }
    }, (error) => {
      console.error(error);
    })
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

  create() {
    this.submitted = true
    if (this.formProduct.valid) {
    this.http.post("http://localhost:8000/admin/product/create",this.productobj).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.loadnew();
        this.formProduct.reset()
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

  getdatabyid(id:any){
    this.http.get("http://localhost:8000/admin/product/databyid/"+id).subscribe((response:any)=>{
      console.log(response);
      
      if (response) {
        this.product.MaSanPham = response[0].MaSanPham;
        this.product.TenSanPham = response[0].TenSanPham;
        this.product.MaLoai = response[0].MaLoai;
        this.product.MaHang = response[0].MaHang;
        this.product.LuotXem = response[0].LuotXem;
        this.product.TrangThai = response[0].TrangThai.data[0];
        this.product.MoTaNgan = response[0].MoTaNgan;
        this.product.MoTa = response[0].MoTa;
      }
      
    },(error)=>{
        console.log(error)
    })
  }

  edit() {
    this.http.post("http://localhost:8000/admin/product/update", this.product).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.search();
      }
      else {
        alert("sửa thất bại")
        console.log(response.message);
      }
    }, (error) => {
      console.error(error);

    })
  }
  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/product/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
          this.search();
        }
        else {
          alert("xóa thất bại")
          console.log(response.message);  
        }
      }, (error) => {
        console.error(error);
      })
    }
  }

  redirettodetail(id:any){
    this.route.navigate(['products/detailproducts/'+id]);
  }

  selectedAll(event: any) {
    const isChecked = event.target.checked
    this.checkedAll = isChecked
    if (isChecked) {
      this.selectedItems = [...this.allProducts]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaSanPham === item.MaSanPham);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaSanPham != item.MaSanPham)
    }
    this.checkedAll = this.selectedItems.length === this.products.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các màu đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/product/delete/" + item.MaSanPham).subscribe((response: any) => {
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
