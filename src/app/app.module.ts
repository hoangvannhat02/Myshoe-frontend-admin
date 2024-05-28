import { NgModule, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { ProductsComponent } from './products/products.component';
import { HeaderComponent } from './layout/header/header.component';
import { CategoriesComponent } from './categories/categories.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { ColorsComponent } from './colors/colors.component';
import { BrandsComponent } from './brands/brands.component';
import { SizesComponent } from './sizes/sizes.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { ImportinvoicesComponent } from './importinvoices/importinvoices.component';
import { DetailproductsComponent } from './products/detailproducts/detailproducts.component';
import { UsersComponent } from './users/users.component';
import { DatePipe } from '@angular/common';
import { DetailimportvoicesComponent } from './importinvoices/detailimportvoices/detailimportvoices.component';
import { BillofsaleComponent } from './billofsale/billofsale.component';
import { DetailbillofsaleComponent } from './billofsale/detailbillofsale/detailbillofsale.component';
import { TransportComponent } from './transport/transport.component';
import { VoucherComponent } from './voucher/voucher.component';
import { CategoryvoucherComponent } from './voucher/categoryvoucher/categoryvoucher.component';
import { NewsComponent } from './news/news.component';
import { CategorynewsComponent } from './news/categorynews/categorynews.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LoginComponent } from './login/login.component';
import { TokenInterceptorService } from 'src/help/token-interceptor.service';
import { StatisticalComponent } from './statistical/statistical.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule,NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { MessageComponent } from './message/message.component';
import { environment } from '../environment/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { TimeAgoPipe } from './myservice/time-ago.pipe';
import { OrtherComponent } from './orther/orther.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ProductsComponent,
    HeaderComponent,
    CategoriesComponent,
    ColorsComponent,
    BrandsComponent,
    SizesComponent,
    SuppliersComponent,
    ImportinvoicesComponent,
    DetailproductsComponent,
    UsersComponent,
    DetailimportvoicesComponent,
    BillofsaleComponent,
    DetailbillofsaleComponent,
    TransportComponent,
    VoucherComponent,
    NewsComponent,
    CategoryvoucherComponent,
    CategorynewsComponent,
    LoginComponent,
    MessageComponent,
    StatisticalComponent,
    OrtherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgxPaginationModule,
    CKEditorModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxChartsModule,
    CalendarModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    TimeAgoPipe  
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
