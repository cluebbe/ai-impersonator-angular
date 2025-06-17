import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface User {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null = null;

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  login(username: string, password: string): Promise<boolean> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    });

    return this.http.get<User>('http://localhost:3000/user', { headers }).toPromise()
      .then(user => {
        console.log('User logged in:', user);
        this.currentUser = user ? user : null;
        return this.currentUser !== null;
      })
      .catch(() => {
        this.currentUser = null;
        return false;
      });
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentUserRole(): string | null {
    return this.currentUser ? this.currentUser.role : null;
  }
}
