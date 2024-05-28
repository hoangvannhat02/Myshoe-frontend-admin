import {  Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  isMenuListVisible: boolean = false;
  isMenuListVisibleVoucher: boolean = false;
  isMenuListVisibleNew: boolean = false;

  sellingproduct: any = []
  detailbill: any = []

  multi: any[] = [
    {
      "name": "Doanh thu",
      "series": [
        {
          "name": "1",
          "value": 0
        },
        {
          "name": "2",
          "value": 0
        },
        {
          "name": "3",
          "value": 0
        },
        {
          "name": "4",
          "value": 0
        },
        {
          "name": "5",
          "value": 0
        },
        {
          "name": "6",
          "value": 0
        },
        {
          "name": "7",
          "value": 0
        },
        {
          "name": "8",
          "value": 0
        },
        {
          "name": "9",
          "value": 0
        },
        {
          "name": "10",
          "value": 0
        },
        {
          "name": "11",
          "value": 0
        },
        {
          "name": "12",
          "value": 0
        }
      ]
    }
  ];
  view: any[number] = [900, 400];

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;

  xAxisLabel: string = 'Biểu đồ doanh thu năm';
  yAxisLabel: string = '';
  timeline: boolean = true;

  colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  //Pie Chart
  single: any[] = []
  viewPie: any[number] = [650, 400];
  gradient: boolean = true;
  showLegendPie: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  colorSchemePieChart: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  //Vertical bar chart
  singlechart: any[] = []
  viewVertical: any[number] = [700, 400];
  showLegend = true
  showXAxis = true;
  showYAxis = true;
  gradientVertical = false;
  xAxisLabelVertical = '';
  yAxisLabelVertical = '';

  colorSchemeVertical: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  monthBarChart: any
  datelyRevenueBarchart: any[] = [];
  dataRevenueBar: any[] = []

  dataCheckout: any
  date: any;
  month: any;
  yearpie: any;
  rangeDates: any;
  dataImportBill: any

  chosseFormat: number = 1
  totalRevenua: number = 0

  monthlyRevenue: { [month: number]: number } = {};
  dataRevenuePie: {
    waiting: number,
    transporting: number,
    destroy: number,
    delivered: number
  } = {
      waiting: 0,
      transporting: 0,
      destroy: 0,
      delivered: 0
    };

  dateTimeNow: any = Date.now();

  quantityBillWaiting: number = 0
  quantityComment: number = 0
  constructor(private renderer: Renderer2, private el: ElementRef,
    private http: HttpClient
  ) {
  }

  toggleMenuList() {
    this.isMenuListVisible = !this.isMenuListVisible;
  }
  toggleMenuListVoucher() {
    this.isMenuListVisibleVoucher = !this.isMenuListVisible;
  }
  toggleMenuListNew() {
    this.isMenuListVisibleNew = !this.isMenuListVisible;
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

  ngOnInit(): void {
    this.getImportBill()
    let getYear = new Date(this.dateTimeNow)
    this.date = (getYear.getFullYear()).toString()
    this.month = (getYear.getMonth() + 1).toString() + "/" + this.date
    this.monthBarChart = (getYear.getMonth() + 1).toString() + "/" + this.date

    //Phần hiển thị barchart
    this.xAxisLabelVertical += "Doanh thu tháng " + (getYear.getMonth() + 1).toString() + "/" + this.date
    this.yAxisLabelVertical += "Năm " + this.date
    this.getBillForLineChart(getYear.getFullYear(), getYear.getMonth() + 1)
    this.getBillForPieChart(getYear.getFullYear(), getYear.getMonth() + 1)
    this.getBillForBarChart(getYear.getFullYear(), getYear.getMonth() + 1)
    this.getDataBill()
    this.getDataEvaluate()
    this.getsellingproduct()
  }

  getDataBill() {
    this.http.get("http://localhost:8000/admin/billofsale/data").subscribe((response: any) => {
      if (response) {
        this.quantityBillWaiting = response.reduce((sum: number, data: any) => {
          if (data.TrangThai === 0) {
            return sum + 1
          } else {
            return sum
          }
        }, 0)
      }
    })
  }

  getDataEvaluate() {
    this.http.get("http://localhost:8000/user/evaluate/getdata").subscribe((response: any) => {
      if (response) {
        this.quantityComment = response.reduce((sum: number, data: any) => sum + 1, 0)
      }
    })
  }

  getBillForPieChart(year: number, month?: number, startDate?: number, endDate?: number) {
    this.http.get("http://localhost:8000/admin/billofsale/data").subscribe(async (response) => {
      if (response) {
        this.dataCheckout = response
        let ordersInYear = this.dataCheckout.filter((order: any) => {
          let orderDate = new Date(order.NgayTao);
          return orderDate.getFullYear() === year;
        });
        this.transformDataPieChart(ordersInYear, year, month)
      }
    })
  }

  getBillForLineChart(year: number, month?: number) {
    this.http.get("http://localhost:8000/admin/billofsale/data").subscribe(async (response) => {
      if (response) {
        this.dataCheckout = response
        let ordersInYear = this.dataCheckout.filter((order: any) => {
          let orderDate = new Date(order.NgayTao);
          return orderDate.getFullYear() === year;
        });
        this.transformData(ordersInYear, year)
      }
    })
  }

  getBillForBarChart(year: number, month: number) {
    this.http.get("http://localhost:8000/admin/billofsale/data").subscribe(async (response) => {
      if (response) {
        this.dataCheckout = response
        let ordersInYear = this.dataCheckout.filter((order: any) => {
          let orderDate = new Date(order.NgayTao);
          return orderDate.getFullYear() === year;
        });
        this.transformDataBarChart(ordersInYear, month, year)
      }
    })
  }

  async getTotalRevenua(item: any): Promise<number> {
    //Lấy thông tin chi tiết hóa đơn bán    
    let dataCheckout = await this.getDetailCheckout(item.MaHoaDon)

    let totalImportPrices = dataCheckout.reduce((sum: number, currentValue: any) => {
      var getDataBill = this.dataImportBill.find((data: any) => data.MaChiTietSanPham === currentValue.MaChiTietSanPham);
      sum += getDataBill.GiaNhap * currentValue.SoLuong
      return sum
    }, 0)
    let totalRevenua = item.TongTien - totalImportPrices
    return totalRevenua
  }

  async getDetailCheckout(id: any): Promise<any[]> {
    try {
      const response = await this.http.get<any[]>("http://localhost:8000/admin/detailbillofsale/datainfoproductbyid/" + id).toPromise();
      if (response) {
        return response;
      }
      return []
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  async transformData(data: any, year: any) {
    this.monthlyRevenue = {}
    if (data.length === 0) {
      this.multi = [
        {
          "name": "doanh thu",
          "series": []
        }
      ]
    }
    this.yAxisLabel = "Năm " + year
    for (const order of data) {
      let orderDate = new Date(order.NgayTao)
      let month = orderDate.getMonth() + 1;
      if (order.TrangThai === 2) {
        let monthlyRevenue = await this.getTotalRevenua(order);
        if (!this.monthlyRevenue[month]) {
          this.monthlyRevenue[month] = 0;
        }
        this.monthlyRevenue[month] += monthlyRevenue;
      }
    }
    this.updateChartData()
  }

  updateChartData() {
    this.multi = [
      {
        "name": "doanh thu",
        "series": []
      }
    ]
    for (let month = 1; month <= 12; month++) {
      const monthName = month.toString();
      const monthlyRevenue = this.monthlyRevenue[month] || 0; // Nếu không có dữ liệu, mặc định là 0
      const seriesData = { name: monthName, value: monthlyRevenue };
      this.multi[0].series.push(seriesData);
    }
  }

  async transformDataPieChart(data: any, year: any, month?: any, startDate?: any, endDate?: any) {
    this.dataRevenuePie = {
      waiting: 0,
      transporting: 0,
      destroy: 0,
      delivered: 0
    }
    if (month != undefined && year) {
      for (const order of data) {
        let orderDate = new Date(order.NgayTao)
        let getmonth = orderDate.getMonth() + 1;
        if (getmonth === month) {
          if (order.TrangThai === 0) {
            this.dataRevenuePie.waiting++
          }
          if (order.TrangThai === 1) {
            this.dataRevenuePie.transporting++
          }
          if (order.TrangThai === 3) {
            this.dataRevenuePie.destroy++
          }
          if (order.TrangThai === 2) {
            this.dataRevenuePie.delivered++
          }

        }
      }
      this.updateChartDataPie()
    } else if (year) {
      for (const order of data) {
        if (order.TrangThai === 0) {
          this.dataRevenuePie.waiting++
        }
        if (order.TrangThai === 1) {
          this.dataRevenuePie.transporting++
        }
        if (order.TrangThai === 3) {
          this.dataRevenuePie.destroy++
        }
        if (order.TrangThai === 2) {
          this.dataRevenuePie.delivered++
        }
      }
      this.updateChartDataPie()
    } else if (startDate != undefined && endDate != undefined && month != undefined && year) {
      for (const order of data) {
        let orderDate = new Date(order.NgayTao)
        let getmonth = orderDate.getMonth() + 1;
        let getyear = orderDate.getFullYear()
        let getDate = orderDate.getDate()
        if (getmonth == month && getyear == year && getDate >= startDate && getDate <= endDate) {
          if (order.TrangThai === 0) {
            this.dataRevenuePie.waiting++
          }
          if (order.TrangThai === 1) {
            this.dataRevenuePie.transporting++
          }
          if (order.TrangThai === 3) {
            this.dataRevenuePie.destroy++
          }
          if (order.TrangThai === 2) {
            this.dataRevenuePie.delivered++
          }

        }
      }
      this.updateChartDataPie()
    }

  }

  updateChartDataPie() {
    this.single = []
    for (let key in this.dataRevenuePie) {
      if (this.dataRevenuePie.hasOwnProperty(key)) {
        let pair = {
          name: key === 'waiting' ? "Đơn hàng chờ duyệt" : (key === 'transporting' ? "Đang vận chuyển" : (key === "destroy" ? "Đơn hàng bị hủy" : (key === "delivered" ? "Đơn hàng đã giao" : key))),
          value: this.dataRevenuePie[key as keyof typeof this.dataRevenuePie]
        };
        this.single.push(pair);
      }
    }
  }

  async transformDataBarChart(data: any, month?: any, year?: any) {
    this.dataRevenueBar = []
    if (this.datelyRevenueBarchart.length === 0) {
      // Tính số ngày trong tháng được chọn
      const daysInMonth = new Date(year, month, 0).getDate();

      // Tạo một mảng chứa tất cả các ngày trong tháng
      const allDaysInMonth: Date[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        allDaysInMonth.push(currentDate);
      }


      for (let day = 0; day < allDaysInMonth.length; day++) {
        this.datelyRevenueBarchart.push(allDaysInMonth[day].getDate())
      }
    }
    for (let i = 0; i < this.datelyRevenueBarchart.length; i++) {
      let currentDate = this.datelyRevenueBarchart[i];
      let total = 0; // Giá trị mặc định là 0 nếu không có đơn hàng trong ngày
      for (const order of data) {
        let orderDate = new Date(order.NgayTao);
        let getmonth = orderDate.getMonth() + 1;
        let getdate = orderDate.getDate();
        if (getmonth === month && getdate === currentDate && order.TrangThai === 2) {
          total += await this.getTotalRevenua(order);
        }
      }
      this.dataRevenueBar.push({
        name: currentDate,
        value: total
      });
    }
    this.singlechart = this.dataRevenueBar
    console.log(this.singlechart);

  }

  getImportBill() {
    this.http.get("http://localhost:8000/admin/detailimportinvoice/data").subscribe((response) => {
      this.dataImportBill = response
    })
  }

  changeYear(event: any) {
    let getYear = event.getFullYear();
    this.getBillForLineChart(getYear)
  }

  changeMonth(event: any) {
    this.getBillForPieChart(event.getFullYear(), event.getMonth() + 1)
  }

  changeRangeDay(event: any) {
    const startDate = event[0]; // Ngày bắt đầu trong khoảng ngày
    const endDate = event[1]; // Ngày kết thúc trong khoảng ngày
    const month = event[0].getMonth() + 1
    const year = event[0].getFullYear()
    this.getBillForPieChart(year, month, startDate.getDate(), endDate.getDate())
  }

  changeYearPie(event: any) {
    this.getBillForPieChart(event.getFullYear())
  }

  changeFormatDate(event: any) {
    this.single = []
    this.month = ""
    this.chosseFormat = Number(event.target.value)
  }

  changeMonthBarChart(event: any) {
    this.datelyRevenueBarchart = []
    this.xAxisLabelVertical = ""
    this.yAxisLabelVertical = ""
    // Lấy tháng và năm từ event
    const selectedMonth = event.getMonth(); // Lấy tháng (0-11)
    const selectedYear = event.getFullYear(); // Lấy năm
    this.xAxisLabelVertical += "Doanh thu tháng " + (selectedMonth + 1).toString() + "/" + selectedYear
    this.yAxisLabelVertical += "Năm " + selectedYear
    // Tính số ngày trong tháng được chọn
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // Tạo một mảng chứa tất cả các ngày trong tháng
    const allDaysInMonth: Date[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedYear, selectedMonth, day);
      allDaysInMonth.push(currentDate);
    }


    for (let day = 0; day < allDaysInMonth.length; day++) {
      this.datelyRevenueBarchart.push(allDaysInMonth[day].getDate())
    }
    this.getBillForBarChart(selectedYear, selectedMonth + 1)
  }

  getsellingproduct(): void {
    this.http.get("http://localhost:8000/admin/billofsale/sellingproduct").subscribe((respone: any) => {
      if (respone) {
        this.sellingproduct = respone
        console.log(this.sellingproduct);

      }
    })
  }

  onSelect(data: any): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
