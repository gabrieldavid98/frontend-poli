import { Component } from '@angular/core';
import { Producto } from '../producto';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {
  status = 0;

  constructor(private productsService: ProductsService, private router: Router) {

  }

  onSubmit(producto: Producto): void {
    console.log(this.productsService)
    this.productsService.createProduct(producto)
      .subscribe({
        next: product => {
          this.status = 200;
          setTimeout(() => this.router.navigate(['products', product.id, 'detail']), 1000)
        },
        error: (err: HttpErrorResponse) => this.status = err.status
      })
  }
}
