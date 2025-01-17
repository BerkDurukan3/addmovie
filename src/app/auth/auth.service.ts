import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private loggedInStatus = false;

  constructor() { }

  setLoggedIn(status: boolean) {
    this.loggedInStatus = status;
    localStorage.setItem('loggedIn', status.toString());
  }

  get isLoggedIn() {
    return this.loggedInStatus || localStorage.getItem('loggedIn') === 'true';
  }

  logout() {
    this.setLoggedIn(false);
  }
}