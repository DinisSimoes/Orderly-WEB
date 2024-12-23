import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL base da API
  private apiUrl = 'https://localhost:7154/api/Orders';

  constructor(private http: HttpClient) {}

  // Exemplo de chamada GET para obter dados
  getOrders(): Observable<any> {
    return this.http.get(this.apiUrl + '/all');
  }

  // Exemplo de chamada POST para enviar dados
  addOrder(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  editOrder(id: string, status: number): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id, status);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
