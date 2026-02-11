import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Client } from '../../models/client.model';
import { MOCK_CLIENTS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private clients: Client[] = [...MOCK_CLIENTS];

  getAll(): Observable<Client[]> {
    return of([...this.clients]).pipe(delay(300));
  }

  getById(id: string): Observable<Client> {
    const client = this.clients.find((c) => c.id === id);
    if (!client) return throwError(() => new Error('Client not found'));
    return of({ ...client }).pipe(delay(300));
  }

  create(client: Omit<Client, 'id' | 'createdAt'>): Observable<Client> {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.clients.push(newClient);
    return of({ ...newClient }).pipe(delay(300));
  }

  update(client: Client): Observable<Client> {
    const index = this.clients.findIndex((c) => c.id === client.id);
    if (index === -1) return throwError(() => new Error('Client not found'));
    this.clients[index] = { ...client };
    return of({ ...client }).pipe(delay(300));
  }

  delete(id: string): Observable<string> {
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) return throwError(() => new Error('Client not found'));
    this.clients.splice(index, 1);
    return of(id).pipe(delay(300));
  }
}
