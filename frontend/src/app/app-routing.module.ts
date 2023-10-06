import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductsComponent } from './products/products.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'VFRESCO'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'VFRESCO'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'VFRESCO'
  },
  {
    path: 'products/create',
    component: ProductCreateComponent,
    title: 'VFRESCO',
    canActivate: [authGuard]
  },
  {
    path: 'products/:id/detail',
    component: ProductDetailComponent,
    title: 'VFRESCO'
  },
  {
    path: 'products/:id/edit',
    component: ProductEditComponent,
    title: 'VFRESCO',
    canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
