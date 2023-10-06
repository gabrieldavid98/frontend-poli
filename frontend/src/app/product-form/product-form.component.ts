import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Producto } from '../producto';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  @Input() product?: Producto;
  @Output() onSubmitForm = new EventEmitter<Producto>();

  productForm = this.fb.group({
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    onSale: false,
  });

  imagen = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [this.product?.nombre ?? '', [Validators.required, Validators.minLength(5)]],
      price: [this.product?.precio ?? 0, [Validators.required, Validators.min(1)]],
      quantity: [this.product?.cantidad ?? 0, [Validators.required, Validators.min(1)]],
      description: [this.product?.descripcion ?? '', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      onSale: this.product?.enPromocion ?? false
    });

    this.imagen = this.product?.imagen ?? '';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return
    }

    this.onSubmitForm.emit({
      id: this.product?.id ?? 0,
      nombre: this.productForm.value.name!,
      imagen: this.imagen,
      precio: this.productForm.value.price!,
      cantidad: this.productForm.value.quantity!,
      descripcion: this.productForm.value.description!,
      enPromocion: this.productForm.value.onSale!
    })
  }

  loadImg(ev: Event) {
    const file = (ev.target as HTMLInputElement).files![0];
    const reader = new FileReader();

    reader.addEventListener('load', () => this.imagen = reader.result as string)

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}
