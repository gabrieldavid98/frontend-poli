import { Injectable } from '@angular/core';
import { Producto } from './producto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRODUCTS_ENDPOINT } from './common/constants';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private authHeader: HttpHeaders;

  constructor(private http: HttpClient) {
    this.authHeader = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(PRODUCTS_ENDPOINT)
  }

  getLast3Products(): Observable<Producto[]> {
    return this.http.get<Producto[]>(PRODUCTS_ENDPOINT)
      .pipe(
        map(([p1, p2, p3, ...rest], _) => [p1, p2, p3])
      )
  }

  getProductById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${PRODUCTS_ENDPOINT}/${id}`)
  }

  createProduct(product: Producto): Observable<Producto> {
    return this.http.post<Producto>(PRODUCTS_ENDPOINT, product, { headers: this.authHeader })
  }

  editProduct(product: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${PRODUCTS_ENDPOINT}/${product.id}`, product, { headers: this.authHeader })
  }

  deleteProduct(id: number): Observable<Producto> {
    return this.http.delete<Producto>(`${PRODUCTS_ENDPOINT}/${id}`, { headers: this.authHeader })
  }

  private getToken(): string {
    return sessionStorage.getItem('token') ?? '';
  }
}
