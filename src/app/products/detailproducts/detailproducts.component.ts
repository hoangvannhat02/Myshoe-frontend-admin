import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detailproducts',
  templateUrl: './detailproducts.component.html',
  styleUrls: ['./detailproducts.component.css'],

})
export class DetailproductsComponent {
  @ViewChild('fileinput') fileInput!: ElementRef;
  searchKeyWord = ""
  imageSrc: any;
  currentimageSrc: any;
  btnimg = "Thêm mới";
  listimg = {
    "MaAnh": "",
    "MaMau": 0,
    "MaChiTietSanPham": 0,
    "DuongDan": ""
  };

  filterColor: any[] = []
  filterSize: any[] = []

  selectedSize:any = ""
  selectedColor:any = ""
  listimgs: any;
  selectedFile: any;
  id: any = 0;
  colors: any;
  sizes: any;
  detailproduct = {
    "MaChiTietSanPham": 0,
    "MaSanPham": 0,
    "MaMau": 0,
    "MaKichThuoc": 0,
    "GiaBan": 0,
    "GiaKhuyenMai": 0,
    "SoLuongTon": 0
  };
  detailproducts: any;
  detailproductobj = {
    "MaSanPham": 0,
    "MaMau": 0,
    "MaKichThuoc": 0,
    "GiaBan": 0,
    "GiaKhuyenMai": 0,
    "SoLuongTon": 0
  }

  allDetailProducts: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formDetailProduct: FormGroup
  filteredProducts:any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private el: ElementRef
  ) {
    this.formDetailProduct = this.fb.group({
      MaMau: [0, [Validators.required, Validators.min(1)]],
      MaKichThuoc: [0, [Validators.required, Validators.min(1)]],
      GiaBan: [0, [Validators.required, Validators.min(1)]],
      GiaKhuyenMai: [0, [Validators.required, Validators.min(1)]],
    }, { validator: this.checkGiaTri });
  };
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getdataid(this.id);
    this.getdatacolors();
    this.getdatasizes();

    this.renderer.listen('document', 'click', (event) => {
      // event.preventDefault();
      const clickedElement = event.target as HTMLElement;

      const closestIconMark = clickedElement.closest(".iconclose");

      if (closestIconMark) {
        const showModel = this.el.nativeElement.querySelectorAll('.showmodel');
        showModel.forEach((element: any) => {
          this.renderer.setStyle(element, 'display', 'none');
        });
      }
    });
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  checkGiaTri(group: any) {
    const giaBan = group.get('GiaBan').value;
    const giaKhuyenMai = group.get('GiaKhuyenMai').value;

    if (giaKhuyenMai > giaBan) {
      group.get('GiaKhuyenMai').setErrors({ notGreaterThan: true });
      return { notGreaterThan: true };
    } else {
      return null
    }

  }

  reload() {
    this.detailproductobj = {
      "MaSanPham": this.id,
      "MaMau": 0,
      "MaKichThuoc": 0,
      "GiaBan": 0,
      "GiaKhuyenMai": 0,
      "SoLuongTon": 0
    }
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

  upfile(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(123);

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  loadoneimg(mamau: any, mact: any) {
    const obj = {
      "MaMau": mamau,
      "MaChiTietSanPham": mact
    }

    this.http.post("http://localhost:8000/admin/product/dataimgbymanyid", obj).subscribe((response: any) => {
      this.listimgs = response
      console.log(this.listimgs)
    }, (error) => {
      console.error(error);
    })
  }

  editimg(mamau: any, mact: any) {
    const obj = {
      "MaMau": mamau,
      "MaChiTietSanPham": mact
    }

    console.log(obj);

    this.http.post("http://localhost:8000/admin/product/dataimgbymanyid", obj).subscribe((response: any) => {
      this.listimg.MaMau = mamau,
        this.listimg.MaChiTietSanPham = mact;
      console.log(response);
      this.loadimg(this.listimg.MaMau, this.listimg.MaChiTietSanPham);
    }, (error) => {
      console.error(error);
    })
  }

  getimgbyid(id: any) {
    this.http.get("http://localhost:8000/admin/product/dataimgbyid/" + id).subscribe((response: any) => {
      this.listimg.MaAnh = response[0].MaAnh;
      this.imageSrc = "http://localhost:8000/" + response[0].DuongDan;
      this.currentimageSrc = response[0].DuongDan;
      this.fileInput.nativeElement.value = '';
      this.btnimg = "Sửa";
      console.log(response)
    }, (error) => {
      console.error(error);
    })
  }

  loadimg(mamau: any, mact: any) {
    const obj = {
      "MaMau": mamau,
      "MaChiTietSanPham": mact
    }
    this.http.post("http://localhost:8000/admin/product/dataimgbymanyid", obj).subscribe((response: any) => {
      // this.listimg = response;
      this.listimgs = response.data;
      if (!response.result) {
        console.log(response.message)
      }
    }, (error) => {
      console.error(error);
    })
  }

  destroyimgbyid(id: any, url: any) {
    if (confirm("Bạn có chắc muốn xóa không?")) {
      this.http.delete("http://localhost:8000/admin/product/deleteimg/" + id).subscribe((response: any) => {
        if (response.result) {
          this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + url).subscribe((response: any) => {
          }, (error) => {
            console.error(error);
          })
          alert(response.message)
          this.loadimg(this.listimg.MaMau, this.listimg.MaChiTietSanPham);
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

  updateimg() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post("http://localhost:8000/upload", formData).subscribe((response: any) => {
        let path = response.url;
        let param = {
          "MaAnh": this.listimg.MaAnh,
          "MaMau": this.listimg.MaMau,
          "MaChiTietSanPham": this.listimg.MaChiTietSanPham,
          "DuongDan": path
        }
        if (path && this.btnimg === 'Thêm mới') {
          if (this.fileInput.nativeElement.value === '') {
            alert("Bạn chưa chọn tệp cần upload")
          }
          else {
            this.http.post("http://localhost:8000/admin/product/createimg", param).subscribe((response: any) => {
              if (response.result) {
                this.loadimg(this.listimg.MaMau, this.listimg.MaChiTietSanPham);
                this.getdataid(this.id)
                alert("Thêm thành công");
                this.imageSrc = '';
                this.fileInput.nativeElement.value = '';
              }
            }, (error) => {
              console.error(error);
            })
          }
        }

        if (path && this.btnimg === 'Sửa') {
          console.log(this.currentimageSrc);
          if (this.fileInput.nativeElement.value === '') {
            alert("Bạn chưa chọn tệp cần upload")
          }
          else {
            this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + this.currentimageSrc).subscribe((response: any) => {
              if (response.success) {
                this.http.post("http://localhost:8000/admin/product/updateimg", param).subscribe((response: any) => {
                  if (response.result) {

                    this.loadimg(this.listimg.MaMau, this.listimg.MaChiTietSanPham);
                    this.imageSrc = '';
                    this.fileInput.nativeElement.value = '';
                    this.getdataid(this.id)
                    alert("Sửa thành công");
                  }
                }, (error) => {
                  console.error(error);
                })
              }
            }, (error) => {
              console.error(error);
            })
          }
        }
      }, (error) => {
        console.error(error);
      })
    }
    else {
      alert("Bạn chưa chọn tệp cần upload")
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post("http://localhost:8000/upload", formData).subscribe((response: any) => {
        let path = response.url;

        console.log(response.url)
        this.imageSrc = "http://localhost:8000/" + path;
      }, (error) => {
        console.error(error);
      })
    }
  }

  getdatacolors() {
    this.http.get("http://localhost:8000/admin/color/data").subscribe((response: any) => {
      this.colors = response;
    }, (error) => {
      console.error(error);
    })
  }

  getdatasizes() {
    this.http.get("http://localhost:8000/admin/size/data").subscribe((response: any) => {
      this.sizes = response;
    }, (error) => {
      console.error(error);
    })
  }

  getdataid(id: any) {
    this.detailproductobj.MaSanPham = id;
    this.http.get("http://localhost:8000/admin/detailproduct/databyproductid/" + id).subscribe((response: any) => {
      if (response.result) {
        this.detailproducts = response.data;
        this.filteredProducts = [...this.detailproducts];
        this.filterColorUnique()
        this.filterSizeUnique()
      }
    }, (error) => {
      console.error(error);
    })
  }

  // Lọc lấy sản phẩm theo mã màu duy nhất
  filterColorUnique() {
    const uniqueProductsByColor: { [key: string]: any } = {};
    this.filteredProducts.forEach((product: any) => {
      if (uniqueProductsByColor[product.MaMau]) {
        return;
      }
      uniqueProductsByColor[product.MaMau] = product;
    });
    this.filterColor = Object.values(uniqueProductsByColor);
  }

  //Lọc lấy theo mã kích thước duy nhất
  filterSizeUnique() {
    const uniqueProductsBySize: { [key: string]: any } = {};
    this.filteredProducts.forEach((product: any) => {
      if (uniqueProductsBySize[product.MaKichThuoc]) {
        return;
      }
      uniqueProductsBySize[product.MaKichThuoc] = product;
    });
    this.filterSize = Object.values(uniqueProductsBySize);
  }

  create() {
    this.submitted = true
    if (this.formDetailProduct.valid) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        this.http.post("http://localhost:8000/upload", formData).subscribe((response: any) => {
          let path = response.url;
          this.imageSrc = "http://localhost:8000/" + path;
        }, (error) => {
          console.error(error);
        })
      }
      this.http.post("http://localhost:8000/admin/detailproduct/create", this.detailproductobj).subscribe((response: any) => {
        if (response.result) {
          this.getdataid(this.detailproductobj.MaSanPham);
          alert(response.message)
          this.formDetailProduct.reset()
          this.submitted = false
          this.reload();
        }
        else {
          alert("thêm thất bại")
        }
      }, (error) => {
        console.error(error);
      })
    }
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/detailproduct/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
          this.getdataid(id);
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

  edit(id: any) {
    this.http.get("http://localhost:8000/admin/detailproduct/databyid/" + id).subscribe((response: any) => {
      if (response.result) {
        this.detailproduct.MaChiTietSanPham = response.data[0].MaChiTietSanPham;
        this.detailproduct.MaSanPham = response.data[0].MaSanPham;
        this.detailproduct.MaMau = response.data[0].MaMau;
        this.detailproduct.MaKichThuoc = response.data[0].MaKichThuoc;
        this.detailproduct.GiaBan = response.data[0].GiaBan;
        this.detailproduct.GiaKhuyenMai = response.data[0].GiaKhuyenMai;
        this.detailproduct.SoLuongTon = response.data[0].SoLuongTon;
        console.log(this.detailproduct);
      }
      else {
        console.log(response.message);
      }
    }, (error) => {
      console.error(error);
    })
  }

  update() {
    this.http.post("http://localhost:8000/admin/detailproduct/update", this.detailproduct).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.getdataid(this.id);
      }
      else {
        alert("sửa thất bại")
        console.log(response.message);
      }
    }, (error) => {
      console.error(error);

    })
  }

  selectedAll(event: any) {
    const isChecked = event.target.checked
    this.checkedAll = isChecked
    if (isChecked) {
      this.selectedItems = [...this.detailproducts]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaChiTietSanPham === item.MaChiTietSanPham);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaChiTietSanPham != item.MaChiTietSanPham)
    }
    this.checkedAll = this.selectedItems.length === this.detailproducts.length
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các màu đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/detailproduct/delete/" + item.MaChiTietSanPham).subscribe((response: any) => {
          if (response.result) {
            this.getdataid(this.id);
          }
        }, (error) => {
          console.error(error);
        })
      })
      this.selectedItems = []
    }
  }

  //Lọc lấy thông tin theo mã màu
  filterByColor(event:any) {
    var idColor = event.target.value
    if (idColor) {
      this.filteredProducts = this.detailproducts.filter((item: any) => item.MaMau === Number(idColor));
    } else {
      this.filteredProducts = [...this.detailproducts]; // Trả về tất cả sản phẩm nếu không có bộ lọc được chọn
    }
    console.log(this.filteredProducts);
  }

  filterByColorAndSize(colorId:any, sizeId: any) {
    if (colorId) {
      if(this.selectedSize){
        this.filteredProducts = this.detailproducts.filter((item: any) => item.MaMau === Number(colorId) && item.MaKichThuoc === Number(this.selectedSize));
      }else{
        this.filteredProducts = this.detailproducts.filter((item: any) => item.MaMau === Number(colorId));
      }
    }
    
    if (sizeId) {      
      if(this.selectedColor){
        this.filteredProducts = this.detailproducts.filter((item: any) => item.MaKichThuoc === Number(sizeId) && item.MaMau === Number(colorId));
      }else{
        this.filteredProducts = this.detailproducts.filter((item: any) => item.MaKichThuoc === Number(sizeId));
      }
    }
    
  }

  filterBySize(event:any) {
    const idSize = event.target.value;
    if (idSize) {
      this.filteredProducts = this.detailproducts.filter((item: any) => item.MaKichThuoc === Number(idSize));
    } else {
      this.filteredProducts = [...this.detailproducts]; // Trả về tất cả sản phẩm nếu không có bộ lọc được chọn
    }
    console.log(this.filteredProducts);
    
  }

  search(){
    if(this.searchKeyWord === ""){
      this.getdataid(this.id)
    }else{
      console.log(this.searchKeyWord);
      
      this.filteredProducts = this.detailproducts.filter((item:any) => item.TenSanPham.toLowerCase().includes(this.searchKeyWord.toLowerCase())
                                                        || item.TenMau.toLowerCase().includes(this.searchKeyWord.toLowerCase())
                                                        || item.TenKichThuoc.toLowerCase().includes(this.searchKeyWord.toLowerCase())
                                                        || item.GiaBan.toString().includes(this.searchKeyWord.toLowerCase())
                                                        || item.GiaKhuyenMai.toString().includes(this.searchKeyWord.toLowerCase())
                                                        || item.SoLuongTon.toString().includes(this.searchKeyWord.toLowerCase())
                                                      )
    }
  }

  reloadFilter(){
    this.selectedColor = ""
    this.selectedSize = ""
    this.getdataid(this.id)
  }
}
