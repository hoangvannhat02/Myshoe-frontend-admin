import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { DetailproductsComponent } from './products/detailproducts/detailproducts.component';
import { UsersComponent } from './users/users.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { ImportinvoicesComponent } from './importinvoices/importinvoices.component';
import { DetailimportvoicesComponent } from './importinvoices/detailimportvoices/detailimportvoices.component';
import { BillofsaleComponent } from './billofsale/billofsale.component';
import { BrandsComponent } from './brands/brands.component';
import { ColorsComponent } from './colors/colors.component';
import { SizesComponent } from './sizes/sizes.component';
import { TransportComponent } from './transport/transport.component';
import { NewsComponent } from './news/news.component';

import { VoucherComponent } from './voucher/voucher.component';
import { CategoryvoucherComponent } from './voucher/categoryvoucher/categoryvoucher.component';
import { CategorynewsComponent } from './news/categorynews/categorynews.component';
import { DetailbillofsaleComponent } from './billofsale/detailbillofsale/detailbillofsale.component';
import { LoginComponent } from './login/login.component';
import { StatisticalComponent } from './statistical/statistical.component';
import { MessageComponent } from './message/message.component';
import { OrtherComponent } from './orther/orther.component';

const routes: Routes = [
  {
    path:'',component:IndexComponent,
  },    
  {
    path:'products',component:ProductsComponent
  },
  {
    path:'products/detailproducts/:id',component:DetailproductsComponent
  },
  {
    path:'category',component:CategoriesComponent
  },
  {
    path:'brand',component:BrandsComponent
  },
  {
    path:'color',component:ColorsComponent
  },
  {
    path:'size',component:SizesComponent
  },
  {
    path:'user',component:UsersComponent
  },
  {
    path:'supplier',component:SuppliersComponent
  },
  {
    path:'importinvoice',component:ImportinvoicesComponent
  },
  {
    path:'detailimportinvoice/:id',component:DetailimportvoicesComponent
  },
  {
    path:'billofsale',component:BillofsaleComponent
  },
  {
    path:'detailbillofsale/:id',component:DetailbillofsaleComponent
  },
  {
    path:'transport',component:TransportComponent
  },
  {
    path:'news',component:NewsComponent
  },
  {
    path:'categorynews',component:CategorynewsComponent
  },
  {
    path:'voucher',component:VoucherComponent
  },
  {
    path:'categoryvoucher',component:CategoryvoucherComponent
  },
  {
    path:'login',component:LoginComponent
  },{
    path:'statistical',component:StatisticalComponent
  },
  {
    path:'message',component:MessageComponent
  },
  {
    path:'orther',component:OrtherComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
