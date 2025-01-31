import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule],
})
export class HeaderComponent {

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToHomePage(): void {
    this.router.navigate(['/home']);
  }

  goToSearchPage(): void {
    this.router.navigate(['/search']);
  }
}