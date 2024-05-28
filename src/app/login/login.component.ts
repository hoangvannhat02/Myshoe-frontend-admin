import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { InputvalidationService } from '../myservice/inputvalidation.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../myservice/toast.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: "",
    password: ""
  }

  user_registration = {
    email: ""
  }

  message_resgistration = {
    email: ""
  }

  message = {
    email: "",
    password: "",
  }

  inforuserbycheckemail: any;
  isEmailInvalid = false
  isPasswordInvalid = false
  isEmailResgisInvalid = false
  isPasswordResgisInvalid = false
  constructor(private el: ElementRef, private router: Router, private renderer: Renderer2, private valid: InputvalidationService, private http: HttpClient, private toatmsg: ToastService) {
    console.log(this.comparePasswords("123","$2a$10$oO9y.hbHzUgcliWJmRNWI.mxM4rwJ4v8cAsfHv8YsH5AO7MYuVsX."));
       
   }
  ngAfterViewInit() {
    const signUpButton = this.el.nativeElement.querySelector('#signUp');
    const signInButton = this.el.nativeElement.querySelector('#signIn');
    const container = this.el.nativeElement.querySelector('#container');

    signUpButton.addEventListener('click', () => {
      this.renderer.addClass(container, 'right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      this.renderer.removeClass(container, 'right-panel-active');
    });
  }

  onInputEmail() {
    this.isEmailInvalid = false
  }
  onInputPassWord() {
    this.isPasswordInvalid = false
  }
  onInputRegisEmail() {
    this.isEmailResgisInvalid = false
  }

  onSubmit() {
    if (!this.user.email.length) {
      this.isEmailInvalid = true;
      this.message.email = "Thông tin tài khoản không được để trống"
    } else if (!this.valid.isValidEmail(this.user.email)) {
      this.isEmailInvalid = true;
      this.message.email = "Không đúng định dạng email"
    } else {
      this.isEmailInvalid = false;
    }


    if (this.user.password.length <= 0) {
      this.isPasswordInvalid = true;
      this.message.password = "Thông tin mật khẩu không được để trống"
    } else if (this.valid.isValidLength(this.user.password, 100)) {
      this.isPasswordInvalid = true;
      this.message.password = "Chỉ có thể nhập tối đa 100 ký tự"
    }
    else {
      this.isPasswordInvalid = false;
    }

    if (!this.isEmailInvalid && !this.isPasswordInvalid) {
      let params = {
        Email: this.user.email,
        PassWord: this.user.password
      }      
      this.http.post("http://localhost:8000/admin/user/login", params).subscribe((response: any) => {
        console.log(response);
        
        if (response.results) {
          const data = localStorage.getItem("user")
          const datauser = data ? JSON.parse(data) : undefined
          if (datauser === undefined) {
            const user = {
              MaNguoiDung: response.results.MaNguoiDung,
              HoTen: response.results.HoTen,
              DiaChi: response.results.DiaChi,
              DienThoai: response.results.DienThoai,
              Email: response.results.Email,
              Anh: response.results.Anh,
              PassWord:response.results.PassWord,
              Quyen: response.results.Quyen,
              TrangThai: response.results.TrangThai,
              ToKen:response.token
            }
            localStorage.setItem("user", JSON.stringify(user))
           
            this.router.navigate(["/"])

            this.toatmsg.showToast({
              title: "Đăng nhập thành công",
              message: "Xin chào, " + user.HoTen,
              type: "success"
            })


          }
          else {
            this.router.navigate(["/"])

            this.toatmsg.showToast({
              title: "Đăng nhập thành công",
              message: "Chào mừng bạn đến với cửa hàng",
              type: "success"
            })


          }

        }
        else {
          this.isPasswordInvalid = true
          this.message.password = "Tài khoản hoặc mật khẩu không chính xác"
        }


      }, (error) => {
        console.error(error);
      })
    }
  }

  onSubmitRegistration() {
    if (!this.user_registration.email.length) {
      this.isEmailResgisInvalid = true;
      this.message_resgistration.email = "Thông tin email không được để trống"
    } else if (!this.valid.isValidEmail(this.user_registration.email)) {
      this.isEmailResgisInvalid = true;
      this.message_resgistration.email = "Không đúng định dạng email"
    } else {
      this.isEmailResgisInvalid = false;
    }

    if (!this.isEmailResgisInvalid) {
      let params = {
        Email: this.user_registration.email
      }
      this.http.post("http://localhost:8000/admin/user/checkemailuser", params).subscribe((response: any) => {
        if (!response.message) {
          this.inforuserbycheckemail = response
          console.log(response);
          alert("Mật khẩu của bạn là: "+response[0].PassWord)
        }
        else {
          this.isEmailResgisInvalid = true
          this.message_resgistration.email = "Tài khoản bạn cung cấp không có trong hệ thống vui lòng xem lại"
          console.log(response);
        }

      }, (error) => {
        this.toatmsg.showToast({
          title:"Lỗi hệ thống",
          message:"Hệ thống đang xảy ra lỗi vui lòng thử lại sau",
          type:"error"
        })
        console.error(error);
      })

    }
  }

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  
  comparePasswords(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
