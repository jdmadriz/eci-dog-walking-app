import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Dog } from '../../models/dog.model';
import { MOCK_DOGS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class DogService {
  private dogs: Dog[] = [...MOCK_DOGS];

  getAll(): Observable<Dog[]> {
    return of([...this.dogs]).pipe(delay(300));
  }

  getByClientId(clientId: string): Observable<Dog[]> {
    const dogs = this.dogs.filter((d) => d.clientId === clientId);
    return of(dogs.map((d) => ({ ...d }))).pipe(delay(300));
  }

  create(dog: Omit<Dog, 'id'>): Observable<Dog> {
    const newDog: Dog = { ...dog, id: crypto.randomUUID() };
    this.dogs.push(newDog);
    return of({ ...newDog }).pipe(delay(300));
  }

  update(dog: Dog): Observable<Dog> {
    const index = this.dogs.findIndex((d) => d.id === dog.id);
    if (index === -1) return throwError(() => new Error('Dog not found'));
    this.dogs[index] = { ...dog };
    return of({ ...dog }).pipe(delay(300));
  }

  delete(id: string): Observable<string> {
    const index = this.dogs.findIndex((d) => d.id === id);
    if (index === -1) return throwError(() => new Error('Dog not found'));
    this.dogs.splice(index, 1);
    return of(id).pipe(delay(300));
  }
}
