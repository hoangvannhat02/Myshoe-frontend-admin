import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {  Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { ToastService } from '../myservice/toast.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  currentImg: any;
  selectedFile: any;
  imageSrc: any;
  imageEditSrc: any;
  filterobj: any = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  users: any;
  user: any = {
    HoTen: "",
    NgaySinh: "",
    DiaChi: "",
    TrangThai: 1,
    Email: "",
    DienThoai: "",
    Quyen: "nhanvien",
    Anh: "",
    PassWord:""
  };
  userobj: any = {
    MaNguoiDung: "",
    HoTen: "",
    NgaySinh: "",
    DiaChi: "",
    TrangThai: 1,
    Email: "",
    DienThoai: "",
    Quyen: "nhanien",
    Anh: "",
    PassWord:""
  };

  userStore: any

  allUsers: any[] = []
  checkedAll: boolean = false
  selectedItems: any[] = [];
  submitted = false
  formUser: FormGroup

  constructor(
    private http: HttpClient,
    private datePiPe: DatePipe,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private toastmsg:ToastService
  ) {
    this.formUser = this.fb.group({
      HoTen: ['', [Validators.required, Validators.minLength(1)]],
      DiaChi: ['', [Validators.required, Validators.minLength(1)]],
      PassWord: ['', [Validators.required, Validators.minLength(1)]],
      Email: ['', [Validators.required, Validators.email]],
      NgaySinh:['',Validators.required],
      DienThoai: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
    });
  };

  ngOnInit(): void {
    let getdatauser = localStorage.getItem("user")
    let data = getdatauser ? JSON.parse(getdatauser) : []
    if (getdatauser) {
      this.userStore = data
    }
    console.log(this.hashPassword("123"));
    console.log(this.hashPassword("123"));
    this.getdata();
    this.getall()
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

  getall() {
    this.http.get("http://localhost:8000/admin/user/data").subscribe((response: any) => {
      if (response) {
        this.allUsers = response        
      }

    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/user/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.userobj.MaNguoiDung = response[0].MaNguoiDung;
        this.userobj.HoTen = response[0].HoTen;
        const formattedDate = this.datePiPe.transform(new Date(response[0].NgaySinh), 'yyyy-MM-dd');
        this.userobj.NgaySinh = formattedDate;
        this.userobj.DiaChi = response[0].DiaChi;
        this.userobj.Email = response[0].Email;
        this.userobj.DienThoai = response[0].DienThoai;
        this.userobj.TrangThai = response[0].TrangThai.data[0];
        this.userobj.Quyen = response[0].Quyen;
        this.userobj.PassWord = response[0].PassWord;
        this.userobj.Anh = response[0].Anh;
        this.imageEditSrc = 'http://localhost:8000/' + this.userobj.Anh;
        this.currentImg = this.userobj.Anh;
      }

    }, (error) => {
      console.error(error);
    })
  }

  add() {
    this.submitted = true
    if (this.formUser.valid) {
      const formattedDate = this.datePiPe.transform(new Date(this.user.NgaySinh), 'yyyy-MM-dd');
      this.user.NgaySinh = formattedDate;
      this.user.PassWord = this.hashPassword(this.user.PassWord) 
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('userImage', this.selectedFile);
        this.http.post("http://localhost:8000/admin/user/uploadfile", formData).subscribe((response: any) => {
          let path = response.url;
          this.user.Anh = path;
          if (path) {
            this.http.post("http://localhost:8000/admin/user/create", this.user).subscribe((response: any) => {
              if (response.result) {
                this.getdata();
                this.loadNew();
                this.formUser.reset()
                this.submitted = false
                this.toastmsg.showToast({
                  title:"Thêm thành công",
                  type:"success"
                })
              }
              else {
                console.log(response.message);
                this.toastmsg.showToast({
                  title:"Có lỗi",
                  type:"error"
                })
              }
            }, (error) => {
              console.error(error);

            })
          }
        }, (error) => {
          console.error(error);
        })
      }
      else {
        console.log(this.user);
        
        this.http.post("http://localhost:8000/admin/user/create", this.user).subscribe((response: any) => {
          console.log(response);
          
          if (response.result) {
            this.getdata();
            this.loadNew();
            this.formUser.reset()
            this.submitted = false
            this.toastmsg.showToast({
              title:"Thêm thành công",
              type:"success"
            })
          }
          else {
            console.log(response.message);
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

  }

  getdata() {
    // const params = new HttpParams().set('Quyen', this.userStore.Quyen);
    // this.filterobj['Quyen'] = this.userStore.Quyen;
    // const headers = new HttpHeaders({
    //   'Authorization': 'Bearer '+this.userStore.ToKen, 
    //   'Content-Type': 'application/json'
    // });

    // const options = { headers };
    this.http.post("http://localhost:8000/admin/user/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        const totalItems = response[0][0].totalperpages;
        if (totalItems === 0) {
          this.totalPages = 1;
        } else {
          this.totalPages = Math.ceil(totalItems / this.filterobj.itemsperpage);
        }
        this.users = response[1];
        if (this.filterobj.pagenumber > this.totalPages) {
          this.filterobj.pagenumber = this.totalPages;
          this.getdata();
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  loadNew() {
    this.user = {
      HoTen: "",
      NgaySinh: "",
      DiaChi: "",
      TrangThai: 0,
      Email: "",
      DienThoai: "",
      Quyen: "nhanvien",
      Anh: "",
      PassWord:""
    };
    this.formUser.reset()
    this.submitted = false
  }

  onPrevious(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber--;
    this.getdata();
  }

  onNext(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber++;
    this.getdata();
  }

  edit() {
    const formattedDate = this.datePiPe.transform(new Date(this.userobj.NgaySinh), 'yyyy-MM-dd');
    this.userobj.NgaySinh = formattedDate;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('userImage', this.selectedFile);
      this.http.post("http://localhost:8000/admin/user/uploadfile", formData).subscribe((response: any) => {
        let path = response.url;
        this.userobj.Anh = path;
        if (path) {
          this.http.post("http://localhost:8000/admin/user/update", this.userobj).subscribe((response: any) => {
            console.log(response);
            
            if (response.result) {
              this.http.delete("http://localhost:8000/admin/user/deleteimg?imageName=" + this.currentImg).subscribe((response: any) => { }
                , (error) => {
                  console.error(error)
                })
                this.toastmsg.showToast({
                  title:"Cập nhật thành công",
                  type:"success"
                })
              this.getdata();
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
      }, (error) => {
        console.error(error);
      })
    }
    else {
      this.http.post("http://localhost:8000/admin/user/update", this.userobj).subscribe((response: any) => {
        console.log(response);
        
        if (response.result) {
          this.toastmsg.showToast({
            title:"Cập nhật thành công",
            type:"success"
          })
          this.getdata();
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

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/user/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          this.toastmsg.showToast({
            title:"Xóa thành công",
            type:"success"
          })
          this.getdata();
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

  upfile(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  upfileuser(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageEditSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  selectedAll(event: any) {
    const isChecked = event.target.checked
    this.checkedAll = isChecked
    if (isChecked) {
      this.selectedItems = [...this.allUsers]
    } else {
      this.selectedItems = []
    }
  }

  isChecked(item: any): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.MaNguoiDung === item.MaNguoiDung);
  }

  checkedItem(event: any, item: any) {
    const ischecked = event.target.checked
    if (ischecked) {
      this.selectedItems.push(item)
    } else {
      this.selectedItems = this.selectedItems.filter(x => x.MaNguoiDung != item.MaNguoiDung)
    }
    this.checkedAll = this.selectedItems.length === this.allUsers.length
  }

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  
  comparePasswords(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  deleteChecked() {
    if (confirm("Bạn có muốn xóa các màu đã chọn này không?")) {
      this.selectedItems.forEach((item) => {
        this.http.delete("http://localhost:8000/admin/user/delete/" + item.MaNguoiDung).subscribe((response: any) => {
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
