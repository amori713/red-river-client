import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  userName = '';
  password = '';
  error = '';
  ok = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.ok = '';
    this.auth.register(this.userName, this.password).subscribe({
      next: () => {
        this.ok = 'Konto skapat! Du kan logga in nu.';
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: () => this.error = 'Kunde inte registrera. Testa annat användarnamn.'
    });
  }
}
