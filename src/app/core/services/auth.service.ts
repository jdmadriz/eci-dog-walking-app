import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map((users) => {
        if (users.length === 1) {
          return users[0];
        }
        throw new Error('Invalid email or password');
      })
    );
  }
}
