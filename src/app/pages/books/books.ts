import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BooksService, Book } from '../../services/books.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.html'
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error = '';

  editing: Book | null = null;

  form = {
    title: '',
    author: '',
    publishedDate: '' // yyyy-mm-dd
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private booksApi: BooksService
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
    this.booksApi.getAll().subscribe({
      next: data => { this.books = data; this.loading = false; },
      error: () => { this.error = 'Kunde inte hämta böcker'; this.loading = false; }
    });
  }

  startCreate() {
    this.editing = null;
    this.form = { title: '', author: '', publishedDate: '' };
  }

  startEdit(b: Book) {
    this.editing = b;
    this.form = {
      title: b.title,
      author: b.author,
      publishedDate: (b.publishedDate || '').slice(0, 10)
    };
  }

  save() {
    this.error = '';

    const payload = {
      title: this.form.title.trim(),
      author: this.form.author.trim(),
      publishedDate: new Date(this.form.publishedDate).toISOString()
    };

    if (!payload.title) {
      this.error = 'Titel krävs';
      return;
    }

    if (this.editing) {
      const updated: Book = { ...this.editing, ...payload };
      this.booksApi.update(updated).subscribe({
        next: () => { this.startCreate(); this.load(); },
        error: () => this.error = 'Kunde inte uppdatera bok'
      });
    } else {
      this.booksApi.create(payload).subscribe({
        next: () => { this.startCreate(); this.load(); },
        error: () => this.error = 'Kunde inte skapa bok'
      });
    }
  }

  remove(id: number) {
    if (!confirm('Radera boken?')) return;
    this.booksApi.delete(id).subscribe({
      next: () => this.load(),
      error: () => this.error = 'Kunde inte radera bok'
    });
  }
}
