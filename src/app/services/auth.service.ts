import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  register(userName: string, password: string) {
    return this.http.post(`${this.baseUrl}/register`, { userName, password });
  }

  login(userName: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { userName, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
