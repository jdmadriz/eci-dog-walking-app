import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Walk } from '../../models/walk.model';
import { MOCK_WALKS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class WalkService {
  private walks: Walk[] = [...MOCK_WALKS];

  getAll(): Observable<Walk[]> {
    return of([...this.walks]).pipe(delay(300));
  }

  getByDogId(dogId: string): Observable<Walk[]> {
    const walks = this.walks.filter((w) => w.dogId === dogId);
    return of(walks.map((w) => ({ ...w }))).pipe(delay(300));
  }

  create(walk: Omit<Walk, 'id'>): Observable<Walk> {
    const newWalk: Walk = { ...walk, id: crypto.randomUUID() };
    this.walks.push(newWalk);
    return of({ ...newWalk }).pipe(delay(300));
  }

  update(walk: Walk): Observable<Walk> {
    const index = this.walks.findIndex((w) => w.id === walk.id);
    if (index === -1) return throwError(() => new Error('Walk not found'));
    this.walks[index] = { ...walk };
    return of({ ...walk }).pipe(delay(300));
  }

  delete(id: string): Observable<string> {
    const index = this.walks.findIndex((w) => w.id === id);
    if (index === -1) return throwError(() => new Error('Walk not found'));
    this.walks.splice(index, 1);
    return of(id).pipe(delay(300));
  }
}
