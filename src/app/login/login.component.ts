import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/home']); 
      return
    }
  }

  onSubmit() {
    if (this.username === 'admin' && this.password === '123456') {
      this.loginError = false;
      this.authService.setLoggedIn(true); 
      this.router.navigate(['/home']);
    } else {
      this.loginError = true; 
    }
  }
}