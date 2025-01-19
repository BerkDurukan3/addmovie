import { Component, inject } from '@angular/core';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { Movie } from '../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-update',
  imports: [MovieDetailsComponent, FormsModule, CommonModule],
  templateUrl: './movie-update.component.html',
  styleUrl: './movie-update.component.scss'
})
export class MovieUpdateComponent {
  
  private _snackBar = inject(MatSnackBar);

  selectedMovie!: Movie;
  addedMovies: Movie [] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadMoviesFromLocalStorage();
    this.route.paramMap.subscribe(params => {
      const movieId = params.get('id');
      if (movieId && this.addedMovies.length) {
        this.selectedMovie = this.addedMovies.find(movie => movie.imdbID === movieId) as Movie;
        if(this.selectedMovie === null || this.selectedMovie === undefined){
          this.router.navigate(['/home']);
          return;
        }
        this.selectedMovie.rating = '';
      }
    });
  }

  onUpdateFormSubmit(updatedData: Movie) {
    this.selectedMovie.rating = updatedData.rating;
    this.saveMoviesToLocalStorage();
    setTimeout(() => {
      this.router.navigate(['/home']); 
    }, 1500);
    this._snackBar.open(`${this.selectedMovie.Title} filminin puanı güncellenmiştir.`, 'Kapat', {
      duration: 3000
    });
  }

  loadMoviesFromLocalStorage(): void {
    const storedMovies = localStorage.getItem('addedMovies');
    if (storedMovies) {
      this.addedMovies = JSON.parse(storedMovies);
    }
  }

  saveMoviesToLocalStorage(): void {
    localStorage.setItem('addedMovies', JSON.stringify(this.addedMovies));
  }
}

