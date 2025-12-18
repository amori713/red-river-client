import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  isDark = false;

  constructor(public auth: AuthService, private router: Router) {}

  toggleTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('theme-dark', this.isDark);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
