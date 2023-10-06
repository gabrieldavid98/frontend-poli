import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  status = 0;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private usersService: UsersService, private router: Router) { }

  onSumit() {
    if (this.loginForm.invalid) {
      return;
    }

    console.log(this.loginForm.value)

    this.usersService.login({
      correo: this.loginForm.value.email!,
      clave: this.loginForm.value.password!
    }).subscribe({
      next: login => {
        sessionStorage.setItem('token', login.apiKey)
        sessionStorage.setItem('id', login.id.toString())
        sessionStorage.setItem('email', login.email)
        sessionStorage.setItem('role', login.role.toString())

        this.router.navigate(['products']);
      },
      error: (err: HttpErrorResponse) => this.status = err.status
    })
  }
}
