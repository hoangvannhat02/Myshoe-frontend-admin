import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/myservice/toast.service';

@Component({
  selector: 'app-detailbillofsale',
  templateUrl: './detailbillofsale.component.html',
  styleUrls: ['./detailbillofsale.component.css']
})
export class DetailbillofsaleComponent {
  id: any
  ispint:boolean = true
  discouttotal = 0
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  allquantity = 0;
  totalPages = 0;
  getsummoney = 0;
  detailbills: any[] = [];
  mota = "";
  btn: string = "Thêm mới";
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastmsg:ToastService
  ) { };

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.getdatabyid(this.id)
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/detailbillofsale/datainfoproductbyid/" + id).subscribe((response: any) => {
      if (response) {
        this.detailbills = response
        console.log(this.detailbills);

        this.allquantity = this.detailbills.reduce((sum, value) => sum + value.SoLuong, 0);
        this.getsummoney = this.detailbills.reduce((sum, value) => sum + (value.SoLuong * value.GiaKhuyenMai), 0);

        switch (this.detailbills[0].LoaiPhieu) {
          case "Phần trăm":
            this.discouttotal += this.getsummoney * this.detailbills[0].GiaTri / 100;
            break;
          case "VND":
            this.discouttotal += this.detailbills[0].GiaTri;
            break
        }
      }
      console.log(this.detailbills)
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

  update() {
    if (this.detailbills[0].TrangThai < 2) {
      if (this.detailbills[0].TrangThai === 1) {
        this.detailbills.forEach((value) => {
          this.http.post("http://localhost:8000/admin/detailproduct/updatequantityproduct", {
            MaChiTietSanPham: value.MaChiTietSanPham,
            SoLuongTon: value.SoLuong
          }).subscribe((response: any) => {
            console.log(response);

            if (response.result) {
              // this.toastmsg.showToast({
              //   title:"Thêm thành công",
              //   type:"success"
              // })
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
        })
      }
      let params = {
        MaHoaDon: this.detailbills[0].MaHoaDon,
        TrangThai: this.detailbills[0].TrangThai += 1,
        trangthaithanhtoan:1
      }

      this.http.post("http://localhost:8000/admin/billofsale/update", params).subscribe((response: any) => {
        if (response.result) {
          this.toastmsg.showToast({
            title:"Duyệt thành công",
            type:"success"
          })
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

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/billofsale/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)

        }
        else {
          alert("xóa thất bại")
        }
      }, (error) => {
        console.error(error);
      })
    }
  }

  public captureScreen() {
    window.print();
  }
}
