import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface User {
  first_name: string;
  last_name: string;
  is_admin: boolean;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://127.0.0.1:8000'; // TO-DO: Update this to FastAPI backend URL
  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr) as User;
      this.loggedIn.next(true);
      this.user.next(user);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUser(): Observable<User | null> {
    return this.user.asObservable();
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login/`, credentials)
      .pipe(
        tap((response) => {
          this.loggedIn.next(true);
          const user: User = {
            first_name: response.first_name,
            last_name: response.last_name,
            is_admin: response.is_admin,
          };
          this.user.next(user);
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  logout() {
    this.loggedIn.next(false);
    this.user.next(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}
