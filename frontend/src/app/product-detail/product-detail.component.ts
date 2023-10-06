import { Component, inject } from '@angular/core';
import { ProductsService } from '../products.service';
import { Producto } from '../producto';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  productId = -1;
  product!: Producto;
  status = 0;
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private usersService: UsersService
  ) {
    this.productId = Number(this.route.snapshot.params['id'])

    this.productsService.getProductById(this.productId)
      .subscribe({
        next: product => this.product = product,
        error: (err: HttpErrorResponse) => this.status = err.status
      });

    this.isAuthenticated = usersService.isAuthenticated();
  }

  onEdit() {
    this.router.navigate(['products', this.productId, 'edit'])
  }

  onDelete() {
    const confirmation = confirm('¿Desea eliminar el producto?');
    if (!confirmation) {
      return;
    }

    this.productsService.deleteProduct(this.productId)
      .subscribe({
        next: _ => this.router.navigate(['products']),
        error: (err: HttpErrorResponse) => this.status = err.status
      })
  }
}
