import { Component, Input } from '@angular/core';
import { Producto } from '../producto';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() product!: Producto;
}
