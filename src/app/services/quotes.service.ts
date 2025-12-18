import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Quote {
  id: number;
  text: string;
  author?: string | null;
}

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMine() {
    return this.http.get<Quote[]>(this.apiUrl + '/api/quotes');
  }

  create(quote: Omit<Quote, 'id'>) {
    return this.http.post<Quote>(this.apiUrl + '/api/quotes', quote);
  }

  update(quote: Quote) {
    return this.http.put<void>(this.apiUrl + `/api/quotes/${quote.id}`, quote);
  }

  delete(id: number) {
    return this.http.delete<void>(this.apiUrl + `/api/quotes/${id}`);
  }
}
