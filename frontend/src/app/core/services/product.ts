import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private baseUrl = 'http://127.0.0.1:8000/articles';

  constructor(private http: HttpClient) {}

  getArticles(category_id?: number): Observable<any[]> {
    let params = new HttpParams();
    if (category_id) {
      params = params.set('category_id', category_id.toString());
    }
    return this.http.get<any[]>(this.baseUrl, { params });
  }
}
