import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: User[] = [];
  currentUser: User | null = null;

  constructor(private http: HttpClient) { }

  init() {
    this.http.get<User[]>('/userlist.json').subscribe({
      next: (users) => this.users = users,
      error: (err) => {
        console.error('Failed to load user list:', err);
        this.users = [];
      }
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
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
