import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  isLoading: boolean = true;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
