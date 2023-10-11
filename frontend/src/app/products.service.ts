import { Injectable } from '@angular/core';
import { Producto } from './producto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRODUCTS_ENDPOINT } from './common/constants';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

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
    return this.http.post<Producto>(PRODUCTS_ENDPOINT, product, { headers: this.getAuthHeader() })
  }

  editProduct(product: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${PRODUCTS_ENDPOINT}/${product.id}`, product, { headers: this.getAuthHeader() })
  }

  deleteProduct(id: number): Observable<Producto> {
    return this.http.delete<Producto>(`${PRODUCTS_ENDPOINT}/${id}`, { headers: this.getAuthHeader() })
  }

  private getAuthHeader(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    })
  }

  private getToken(): string {
    return sessionStorage.getItem('token') ?? '';
  }
}
