import { Component } from '@angular/core';
import { Producto } from '../producto';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent {
  productId = -1;
  product!: Producto;
  status = 0;

  constructor(private route: ActivatedRoute, private productsService: ProductsService, private router: Router) {
    this.productId = Number(this.route.snapshot.params['id'])

    this.productsService.getProductById(this.productId)
      .subscribe(product => this.product = product);
  }

  onSubmit(producto: Producto): void {
    this.productsService.editProduct(producto)
      .subscribe({
        next: product => {
          this.status = 200;
          setTimeout(() => this.router.navigate(['products', product.id, 'detail']), 1000)
        },
        error: (err: HttpErrorResponse) => this.status = err.status
      })
  }
}
