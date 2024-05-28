import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-orther',
  templateUrl: './orther.component.html',
  styleUrl: './orther.component.css'
})
export class OrtherComponent {
  @ViewChild('fileinput') fileinput!: ElementRef
  @ViewChild('fileinputmain') fileinputmain!: ElementRef
  @ViewChild('fileinputmid') fileinputmid!: ElementRef
  @ViewChild('fileinputmidmodel') fileinputmidmodel!: ElementRef
  @ViewChild('fileinputleft') fileinputleft!: ElementRef

  selectedFile: any

  selectedFileMain: any

  selectedFileMid: any
  titlemid: any = ""
  objmid: any = {
    title: "",
    image: ""
  }
  selectedFileMidModel: any
  imgmidmodel: any
  indexmidmodel: any

  selectedFileLeft: any

  imageSrc: any

  indexmain: any
  indexmid: any
  btnmid = "Thêm mới"

  orther: any

  logoimage: any
  imgmid: any

  ortherobj = {
    DiaChi: "",
    DienThoai: "",
    Email: "",
    LienKetFacebook: "",
    LienKetInstagram: ""
  }

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {

  };

  ngOnInit(): void {
    this.getdata()

    this.renderer.listen('document', 'click', (event) => {
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

  ngAfterViewInit(): void {
    const imgBanners = this.el.nativeElement.querySelectorAll('.img-banner');
    console.log(imgBanners);

    imgBanners.forEach((imgBanner: any) => {
      this.renderer.listen(imgBanner, 'click', () => {
        // Lấy đường dẫn hình ảnh từ thuộc tính 'src' của phần tử img
        const fullImageUrl = imgBanner.getAttribute('src');
        // Hiển thị hình ảnh đầy đủ
        this.showFullImage(fullImageUrl);
      });
    });
  }

  showFullImage(fullImageUrl: string): void {
    // Lấy phần tử hình ảnh đầy đủ và thiết lập đường dẫn
    const fullImage = this.el.nativeElement.querySelector('#fullImage');
    fullImage.src = fullImageUrl;
    // Hiển thị container chứa hình ảnh đầy đủ
    this.renderer.setStyle(this.el.nativeElement.querySelector('#fullImageContainer'), 'display', 'block');
  }

  closeFullImage() {
    const fullImageContainer = this.el.nativeElement.querySelector('#fullImageContainer');
    this.renderer.setStyle(fullImageContainer, 'display', 'none');
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

  updateorther() {
    // this.orther.DiaChiCuaHang = this.ortherobj.DiaChi
    // this.orther.DienThoai = this.ortherobj.DienThoai
    // this.orther.Email = this.ortherobj.Email
    // this.orther.LienKetFacebook = this.ortherobj.LienKetFacebook
    // this.orther.LienKetInstagram = this.ortherobj.LienKetInstagram
    this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
      console.log(response);

      if (response.result) {
        alert("Cập nhật thành công")
      }
      else {
        alert("Có lỗi")
      }
    }, (error) => {
      console.error(error);

    })
  }

  addNew() {
    this.fileinput.nativeElement.click()
  }

  addNewLeft() {
    this.fileinputleft.nativeElement.click()
  }

  addNewBannerMain(id: any) {
    if (id !== undefined) {
      this.indexmain = id;
    } else {
      this.indexmain = -1;
    }
    this.fileinputmain.nativeElement.click()

  }

  addNewBannerMid(id?: any) {
    if (id) {
      this.indexmid = id
    }
    this.fileinputmain.nativeElement.click()
  }

  upfile(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.addlogo()
    }
  }

  upfileleft(event: any) {
    this.selectedFileLeft = event.target.files[0];
    if (this.selectedFileLeft) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileLeft);
      this.addBannerLeft()
    }
  }

  upfilemain(event: any) {
    this.selectedFileMain = event.target.files[0];
    if (this.selectedFileMain) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileMain);
      this.addBannerMain()
    }
  }

  upfilemid(event: any) {
    this.selectedFileMid = event.target.files[0];
    if (this.selectedFileMid) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgmid = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFileMid);
    }
  }

  upfilemidmodel(event: any) {
    this.selectedFileMidModel = event.target.files[0];
    if (this.selectedFileMidModel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgmidmodel = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFileMidModel);
    }
  }

  getdata() {
    this.http.get("http://localhost:8000/admin/orther/getdata").subscribe((response) => {
      if (response) {
        this.orther = response
        console.log(typeof this.orther.AnhQuangCaoPhanDau.length);

      }
    }, (error) => {
      console.error(error);
    }
    )
  }

  addlogo() {
    if (this.orther) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('logo', this.selectedFile);
        this.http.post("http://localhost:8000/admin/orther/uploadfile", formData).subscribe((response: any) => {
          let path = response.url;
          const oldOrther = Object.assign({}, this.orther);
          this.orther.Logo = path;
          if (path) {
            this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
              if (response.result) {
                this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + oldOrther.Logo).subscribe((response: any) => {
                  alert("Sửa thành công")
                  this.getdata()
                }
                  , (error) => {
                    console.error(error)
                  })
              }
              else {
                console.log(response.message);
                alert("thêm thất bại")
              }
            }, (error) => {
              console.error(error);

            })
          }
        }, (error) => {
          console.error(error);
        })
      }
    } else {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('logo', this.selectedFile);
        this.http.post("http://localhost:8000/admin/orther/uploadfile", formData).subscribe((response: any) => {
          let path = response.url;
          this.orther.Logo = path;
          if (path) {
            this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
              if (response.result) {
                this.getdata()
              }
              else {
                console.log(response.message);
                alert("thêm thất bại")
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

  }

  addBannerLeft() {
    if (this.orther) {
      if (this.selectedFileLeft) {
        const formData = new FormData();
        formData.append('bannerleft', this.selectedFileLeft);
        this.http.post("http://localhost:8000/admin/orther/uploadfileleft", formData).subscribe((response: any) => {
          let path = response.url;
          const oldOrther = Object.assign({}, this.orther);
          const correctedJsonStr = path.replace(/\\/g, '/');
          this.orther.AnhQuangCaoBenTrai = correctedJsonStr;
          if (path) {
            this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
              if (response.result) {
                console.log(oldOrther);

                this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + oldOrther.AnhQuangCaoBenTrai).subscribe((response: any) => {
                  alert("Sửa thành công")
                  this.getdata()
                }
                  , (error) => {
                    console.error(error)
                  })
              }
              else {
                console.log(response.message);
                alert("thêm thất bại")
              }
            }, (error) => {
              console.error(error);

            })
          }
        }, (error) => {
          console.error(error);
        })
      }
    } else {
      if (this.selectedFileLeft) {
        const formData = new FormData();
        formData.append('bannerleft', this.selectedFileLeft);
        this.http.post("http://localhost:8000/admin/orther/uploadfileleft", formData).subscribe((response: any) => {
          let path = response.url;
          const correctedJsonStr = path.replace(/\\/g, '/');
          this.orther.AnhQuangCaoBenTrai = correctedJsonStr;
          if (path) {
            this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
              if (response.result) {
                alert("Thêm thành công")
                this.getdata()
              }
              else {
                console.log(response.message);
                alert("thêm thất bại")
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
  }

  addBannerMain() {
    if (this.orther.AnhQuangCaoPhanDau.length > 0) {
      if (this.selectedFileMain) {
        const formData = new FormData();
        formData.append('bannermain', this.selectedFileMain);
        this.http.post("http://localhost:8000/admin/orther/uploadfilemain", formData).subscribe((response: any) => {
          console.log(response);

          let path = response.url;
          const oldOrther = Object.assign([], this.orther.AnhQuangCaoPhanDau);

          const correctedJsonStr = path.replace(/\\/g, '/');
          if (this.indexmain == -1) {
            if (path) {
              this.orther.AnhQuangCaoPhanDau.push(correctedJsonStr);
              this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
                if (response.result) {
                  alert("Thêm thành công")
                  this.getdata()
                }
                else {
                  console.log(response.message);
                  alert("thêm thất bại")
                }
              }, (error) => {
                console.error(error);

              })
            }
          } else {


            this.orther.AnhQuangCaoPhanDau[this.indexmain] = correctedJsonStr
            if (path) {
              console.log(oldOrther);
              this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
                if (response.result) {
                  this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + oldOrther[this.indexmain]).subscribe((response: any) => {
                    if (response) {
                      alert("Cập nhật thành công")
                      this.getdata()
                    }
                  }, (error) => {
                    console.error(error);
                  })
                }
                else {
                  alert("thêm thất bại")
                }
              }
                , (error) => {
                  console.error(error)
                })
            }
          }

        }, (error) => {
          console.error(error);
        })
      }
    } else {
      if (this.selectedFileMain) {
        const formData = new FormData();
        formData.append('bannermain', this.selectedFileMain);
        this.http.post("http://localhost:8000/admin/orther/uploadfilemain", formData).subscribe((response: any) => {
          let path = response.url;
          const correctedJsonStr = path.replace(/\\/g, '/');
          this.orther.AnhQuangCaoPhanDau.push(correctedJsonStr);
          if (path) {
            this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
              if (response.result) {
                alert("Sửa thành công")
                this.getdata()
              }
              else {
                alert("thêm thất bại")
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

  }

  addBannerMid() {
    if (this.btnmid === "Thêm mới") {
      if (this.selectedFileMid) {
        if (this.titlemid === "") {
          alert("Vui lòng nhập tiêu đề")
        } else {
          const formData = new FormData();
          formData.append('bannermid', this.selectedFileMid);
          this.http.post("http://localhost:8000/admin/orther/uploadfilemid", formData).subscribe((response: any) => {
            console.log(response);
            let path = response.url;
            const correctedJsonStr = path.replace(/\\/g, '/');
            this.orther.AnhQuangCaoPhanGiua.push({ title: this.titlemid, image: correctedJsonStr });
            console.log(this.orther);

            if (path) {
              this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
                if (response.result) {
                  alert("Thêm thành công")
                  this.titlemid = ""
                  this.imgmid = ""
                  this.fileinputmid.nativeElement.value = '';
                  this.getdata()
                }
                else {
                  alert("thêm thất bại")
                }
              }, (error) => {
                console.error(error);

              })
            }
          }, (error) => {
            console.error(error);
          })
        }

      } else {
        alert("Vui lòng chọn ảnh")
      }
    } else {
      if (this.selectedFileMid) {
        const formData = new FormData();
        formData.append('bannermid', this.selectedFileMid);
        this.http.post("http://localhost:8000/admin/orther/uploadfilemid", formData).subscribe((response: any) => {
          let path = response.url;
          const oldOrther = Object.assign([], this.orther.AnhQuangCaoPhanGiua);

          const correctedJsonStr = path.replace(/\\/g, '/');
          if (this.indexmid) {
            this.orther.AnhQuangCaoPhanGiua[this.indexmid].title = this.titlemid
            this.orther.AnhQuangCaoPhanGiua[this.indexmid].image = correctedJsonStr
            if (path) {
              this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {

                if (response.result) {
                  this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + oldOrther[this.indexmid].image).subscribe((response: any) => {
                    if (response) {
                      alert("Cập nhật thành công")
                      this.getdata()
                    }
                  }, (error) => {
                    console.error(error);
                  })
                }
                else {
                  alert("thêm thất bại")
                }
              }
                , (error) => {
                  console.error(error)
                })
            }
          } else {
            if (path) {
              this.orther.AnhQuangCaoPhanGiua.push({ title: this.titlemid, image: correctedJsonStr });
              this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
                if (response.result) {
                  alert("Sửa thành công")
                  this.getdata()
                }
                else {
                  console.log(response.message);
                  alert("thêm thất bại")
                }
              }, (error) => {
                console.error(error);

              })
            }
          }

        }, (error) => {
          console.error(error);
        })
      } else {
        alert("Vui lòng chọn ảnh")
      }
    }
  }

  deleteBannerMain(id: any) {
    if (confirm("Bạn có chắc chán muốn xóa không")) {
      this.orther.AnhQuangCaoPhanDau.splice(id, 1)
      this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
        if (response.result) {
          this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + this.orther.AnhQuangCaoPhanDau[id]).subscribe((response: any) => {
            if (response) {
              this.getdata()
            }
          }, (error) => {
            console.error(error)
          })
        }
      }, (error) => {
        console.error(error);
      }
      )

    }
  }

  editmidmodel(index: any) {
    const data = this.orther.AnhQuangCaoPhanGiua[index]
    this.objmid.title = data.title
    this.objmid.image = data.image
    this.indexmidmodel = index
    this.imgmidmodel = 'http://localhost:8000/' + data.image
  }

  updatemidmodel() {
    if (this.selectedFileMidModel) {
      if (this.objmid.title === "") {
        alert("Vui lòng nhập tiêu đề")
      } else {
        const formData = new FormData();
        formData.append('bannermid', this.selectedFileMidModel);
        this.http.post("http://localhost:8000/admin/orther/uploadfilemid", formData).subscribe((response: any) => {
          let path = response.url;
          const oldOrther = JSON.parse(JSON.stringify(this.orther.AnhQuangCaoPhanGiua));
          console.log(oldOrther);

          const correctedJsonStr = path.replace(/\\/g, '/');
          this.orther.AnhQuangCaoPhanGiua[this.indexmidmodel].title = this.objmid.title
          this.orther.AnhQuangCaoPhanGiua[this.indexmidmodel].image = correctedJsonStr
          console.log(this.orther);
          if (path) {
            this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
              if (response.result) {
                this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + oldOrther[this.indexmidmodel].image).subscribe((response: any) => {
                  if (response) {
                    alert("Cập nhật thành công")
                    this.fileinputmidmodel.nativeElement = ""
                    this.getdata()
                  }
                }, (error) => {
                  console.error(error);
                })
              }
              else {
                alert("thêm thất bại")
              }
            }, (error) => {
              console.error(error);

            })
          }
        }, (error) => {
          console.error(error);
        })
      }

    } else {
      if (this.objmid.title === "") {
        alert("Vui lòng nhập tiêu đề")
      } else {
        this.orther.AnhQuangCaoPhanGiua[this.indexmidmodel].title = this.objmid.title
        this.orther.AnhQuangCaoPhanGiua[this.indexmidmodel].image = this.objmid.image
        this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
          if (response.result) {
            alert("Sửa thành công")
            this.getdata()
          }
          else {
            alert("thêm thất bại")
          }
        }, (error) => {
          console.error(error);
        })
      }
    }
  }

  deletemid(index: any) {
    if (confirm("Bạn có chắc chán muốn xóa không")) {
      this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + this.orther.AnhQuangCaoPhanGiua[index].image).subscribe((response: any) => {
        if (response) {
          this.orther.AnhQuangCaoPhanGiua.splice(index, 1)
          this.http.post("http://localhost:8000/admin/orther/update", this.orther).subscribe((response: any) => {
            if (response.result) {
              alert("Đã xóa")
              this.getdata()
            }
          }, (error) => {
            console.error(error);
          }
          )
        }
      }, (error) => {
        console.error(error)
      })

    }
  }

  deletelogo(data: any) {
    if (confirm("Bạn có chắc chán muốn xóa không")) {
      this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + data.Logo).subscribe((response: any) => {
        if (response) {
          data.Logo = ""
          this.http.post("http://localhost:8000/admin/orther/update", data).subscribe((response: any) => {
            if (response.result) {
              this.getdata()
              alert("Đã xóa")
            }
          }, (error) => {
            console.error(error);
          }
          )
        }
      }, (error) => {
        console.error(error)
      })

    }
  }

  deleteBannerLeft(data: any) {
    if (confirm("Bạn có chắc chán muốn xóa không")) {
      this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + data.AnhQuangCaoBenTrai).subscribe((response: any) => {
        if (response) {
          data.AnhQuangCaoBenTrai = ""
          this.http.post("http://localhost:8000/admin/orther/update", data).subscribe((response: any) => {
            if (response.result) {
              this.getdata()
              alert("Đã xóa")
            }
          }, (error) => {
            console.error(error);
          }
          )
        }
      }, (error) => {
        console.error(error)
      })

    }
  }
}
