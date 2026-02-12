import { Injectable, inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Dog } from '../../models/dog.model';

  @Injectable({ providedIn: 'root' })
  export class DogService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/dogs';

    getAll(): Observable<Dog[]> {
      return this.http.get<Dog[]>(this.apiUrl);
    }

    getByClientId(clientId: string): Observable<Dog[]> {
      return this.http.get<Dog[]>(`${this.apiUrl}?clientId=${clientId}`);
    }

    create(dog: Omit<Dog, 'id' | 'createdAt'>): Observable<Dog> {
      return this.http.post<Dog>(this.apiUrl, {
        ...dog,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
    }

    update(dog: Partial<Dog> & { id: string }): Observable<Dog> {
      return this.http.patch<Dog>(`${this.apiUrl}/${dog.id}`, dog);
    }

    delete(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }