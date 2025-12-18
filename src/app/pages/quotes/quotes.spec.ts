import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { QuotesService, Quote } from '../../services/quotes.service';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotes.html',
  styleUrls: ['./quotes.scss']
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];
  loading = false;
  error = '';
  editing: Quote | null = null;

  form = {
    text: '',
    author: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private quotesApi: QuotesService
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.quotesApi.getMine().subscribe({
      next: data => { this.quotes = data; this.loading = false; },
      error: () => { this.error = 'Kunde inte hämta citat'; this.loading = false; }
    });
  }

  startCreate() {
    this.editing = null;
    this.form = { text: '', author: '' };
  }

  startEdit(q: Quote) {
    this.editing = q;
    this.form = { text: q.text, author: q.author ?? '' };
  }

  save() {
    this.error = '';

    const payload = {
      text: this.form.text.trim(),
      author: this.form.author.trim() || null
    };

    if (!payload.text) {
      this.error = 'Citat-text krävs';
      return;
    }

    if (this.editing) {
      const updated: Quote = { ...this.editing, ...payload };
      this.quotesApi.update(updated).subscribe({
        next: () => { this.startCreate(); this.load(); },
        error: () => this.error = 'Kunde inte uppdatera citat'
      });
    } else {
      this.quotesApi.create(payload).subscribe({
        next: () => { this.startCreate(); this.load(); },
        error: () => this.error = 'Kunde inte skapa citat'
      });
    }
  }

  remove(id: number) {
    if (!confirm('Radera citatet?')) return;
    this.quotesApi.delete(id).subscribe({
      next: () => this.load(),
      error: () => this.error = 'Kunde inte radera citat'
    });
  }
}
