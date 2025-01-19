import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Movie } from '../models/movie.model';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [],
  imports: [CommonModule, FormsModule],
})
export class HomeComponent {

  private _snackBar = inject(MatSnackBar);
  private intersectionObserver!: IntersectionObserver;

  searchQuery: string = '';
  sortOrder: string = '';
  addedMovies: Movie[] = [];
  displayedMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  page: number = 0;
  pageSize: number = 10;

  constructor(private router: Router, private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadInitialMovies();
  }

  getOptimizedImageUrl(url: string): string {
    if (!url) return '';
    return url.replace(/_SX\d+/, '_SX150');
  }

  loadMoviesFromLocalStorage(): void {
    const storedMovies = localStorage.getItem('addedMovies');
    if (storedMovies) {
      this.addedMovies = JSON.parse(storedMovies);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadInitialMovies() {
    this.addedMovies = this.fetchMovies();
    this.displayedMovies = this.addedMovies.slice(0, this.pageSize);
    this.filteredMovies = this.displayedMovies;
    this.filteredMovies.map(movie => movie.isLoading = true);
    setTimeout(() => {
      this.setupInfiniteScroll();
    }, 500);

  }

  setupInfiniteScroll() {
    const sentinel = document.querySelector('#sentinel') as Element;
    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting ) {
        this.loadMoreMovies();
      }
    });

    if (sentinel) {
      this.intersectionObserver.observe(sentinel);
    }
  }

  loadMoreMovies() {
    this.page++;
    const nextMovies = this.addedMovies.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
    nextMovies.map(movie => movie.isLoading = true);
    this.displayedMovies = [...this.displayedMovies, ...nextMovies];
    this.filteredMovies = [...this.filteredMovies, ...nextMovies];
    this.sortMovies();
  }

  fetchMovies(): Movie[] {
    this.loadMoviesFromLocalStorage()
    return this.addedMovies.reverse();
  }

  removeMovie(movie: Movie) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: movie.Title }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addedMovies = this.addedMovies.filter(m => m !== movie);
        this.displayedMovies = this.displayedMovies.filter(m => m !== movie);
        this.filteredMovies = this.filteredMovies.filter(m => m !== movie);
        this.sortMovies();
        localStorage.setItem('addedMovies', JSON.stringify(this.addedMovies.reverse()));
        this._snackBar.open(`${movie.Title} filmi silinmiştir.`, 'Kapat', {
          duration: 3000
        });
      }
    });
  }

  sortMovies() {
    if (!this.sortOrder) return;

    this.filteredMovies.sort((a, b) => {
      if (a.rating === b.rating) {
        return b.addedDate - a.addedDate; 
      }
      if (this.sortOrder === 'asc') {
        return Number(a.rating) - Number(b.rating);
      } else {
        return Number(b.rating) - Number(a.rating);
      }
    });
  } 

  filterMovies(query: string): void {
    if (!query) {
      this.filteredMovies = [...this.displayedMovies];
    } else {
      this.filteredMovies = this.displayedMovies.filter(movie =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
    }
    this.sortMovies();
  }

  onSortOrderChange(event: any) {
    this.sortOrder = event.target.value;
    this.sortMovies();
  }

  navigateToUpdate(movieId: string) {
    this.router.navigate(['/movie-update', movieId]);
  }

  getRating(rating: string){
    return Number(rating);
  }

  onImageLoad(movie: Movie) {
    movie.isLoading = false;
  }

  onImageError(event: Event, movie: Movie){
    const element = event.target as HTMLImageElement;
    element.src = 'img.png'; 
    movie.isLoading = false;
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}