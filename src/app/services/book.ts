import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Book {
  id: number;
  title: string;
  author: string;
  publishedDate: string; // ISO
}

@Injectable({ providedIn: 'root' })
export class BooksService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Book[]>(this.apiUrl + '/api/books');
  }

  create(book: Omit<Book, 'id'>) {
    return this.http.post<Book>(this.apiUrl + '/api/books', book);
  }

  update(book: Book) {
    return this.http.put<void>(this.apiUrl + `/api/books/${book.id}`, book);
  }

  delete(id: number) {
    return this.http.delete<void>(this.apiUrl + `/api/books/${id}`);
  }
}
