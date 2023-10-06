import { Component } from '@angular/core';
import { Producto } from '../producto';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Producto[] = [];

  constructor(private productsService: ProductsService) {
    this.productsService.getProducts()
      .subscribe(productos => this.products = productos)
  }
}
