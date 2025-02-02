import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(userData.admin || false);
    } else {
      this.isLoggedInSubject.next(false);
      this.isAdminSubject.next(false);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  login(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData));
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(userData.admin || false);
  }
}
