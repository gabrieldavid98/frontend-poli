import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { Observable } from 'rxjs';
import { Login } from './login';
import { HttpClient } from '@angular/common/http';
import { LOGIN_ENDPOINT } from './common/constants';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token') ?? '';
    return token.length == 32;
  }

  login(user: Usuario): Observable<Login> {
    return this.http.post<Login>(LOGIN_ENDPOINT, user)
  }
}
