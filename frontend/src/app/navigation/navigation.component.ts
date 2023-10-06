import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  isAuthenticated = false;

  constructor(private usersService: UsersService, private router: Router) {
    this.isAuthenticated = usersService.isAuthenticated();
  }

  onLogout() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('id')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('role')

    this.router.navigate(['/products']);
  }
}
