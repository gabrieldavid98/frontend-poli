import { Component, inject } from '@angular/core';
import { Producto } from '../producto';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  last3Products: Producto[] = [];
  productsService: ProductsService = inject(ProductsService);

  constructor() {
    this.productsService.getLast3Products()
      .subscribe(productos => this.last3Products = productos)
  }
}
