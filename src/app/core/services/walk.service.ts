  import { Injectable, inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Walk } from '../../models/walk.model';

  @Injectable({ providedIn: 'root' })
  export class WalkService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/walks';

    getAll(): Observable<Walk[]> {
      return this.http.get<Walk[]>(this.apiUrl);
    }

    getByDogId(dogId: string): Observable<Walk[]> {
      return this.http.get<Walk[]>(`${this.apiUrl}?dogId=${dogId}`);
    }

    create(walk: Omit<Walk, 'id' | 'createdAt'>): Observable<Walk> {
      return this.http.post<Walk>(this.apiUrl, {
        ...walk,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
    }

    update(walk: Partial<Walk> & { id: string }): Observable<Walk> {
      return this.http.patch<Walk>(`${this.apiUrl}/${walk.id}`, walk);
    }

    delete(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }