import { Injectable, inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Client } from '../../models/client.model';

  @Injectable({ providedIn: 'root' })
  export class ClientService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/clients';

    getAll(): Observable<Client[]> {
      return this.http.get<Client[]>(this.apiUrl);
    }

    getById(id: string): Observable<Client> {
      return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    create(client: Omit<Client, 'id' | 'createdAt'>): Observable<Client> {
      return this.http.post<Client>(this.apiUrl, {
        ...client,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
    }

    update(client: Partial<Client> & { id: string }): Observable<Client> {
      return this.http.patch<Client>(`${this.apiUrl}/${client.id}`, client);
    }

    delete(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }