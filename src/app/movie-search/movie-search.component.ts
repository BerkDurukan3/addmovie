import { Component, inject, OnInit } from '@angular/core';
import { OmdbService } from '../omdb.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Movie } from '../models/movie.model';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatSnackBar} from '@angular/material/snack-bar'
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-search',
  imports: [FormsModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatListModule, MovieDetailsComponent],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
  providers: [OmdbService],

})
export class MovieSearchComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  searchQuery: string = '';
  movies: Movie[] = [];
  selectedMovie: Movie | null | undefined;
  addedMovies: Movie[] = [];

  page: number = 1;
  pageSize: number = 10;
  loading: boolean = false;
  isLoading: boolean = true;

  constructor(private omdbService: OmdbService) {
  }

  ngOnInit() {
    this.loadMoviesFromLocalStorage();
    setTimeout(() => {
      this.isLoading = false;
      this.setupInfiniteScroll();
    }, 500);
  }

  setupInfiniteScroll() {
    const sentinel = document.querySelector('#sentinel') as Element;
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.searchQuery) {
        this.page++;
        this.loadMovies();
      }
    });

    intersectionObserver.observe(sentinel);
  }

  loadMovies() {
    if (!this.loading) {
      this.loading = true;
      this.omdbService.searchMovies(this.searchQuery, this.page, this.pageSize).subscribe(data => {
        this.movies = [...this.movies, ...data.Search || []];
        this.loading = false;
      });
    }
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
  }

  onSearch(): void {
    this.selectedMovie = null;
    if (this.searchQuery.length > 2) {
      this.page = 1;
      this.movies = [];
      this.loadMovies();
    }else{
      this.movies = [];
    }
  }

  addMovie(): void {
    if (this.selectedMovie) {
      const movieExists = this.addedMovies.some(movie => movie.imdbID === this.selectedMovie?.imdbID);
      if (!movieExists) {
        const newMovie = {...this.selectedMovie};
        this.addedMovies.push(newMovie);
        this.saveMoviesToLocalStorage();
        this._snackBar.open(`${newMovie.Title} filmi eklenmiştir.`, 'Kapat', {
          duration: 3000
        });
      } else {
        this._snackBar.open(`${this.selectedMovie.Title} zaten eklenmiş.`, 'Kapat', {
          duration: 3000
        });
      }
      this.selectedMovie = null;
    }
  }

  saveMoviesToLocalStorage(): void {
    localStorage.setItem('addedMovies', JSON.stringify(this.addedMovies));
    this.selectedMovie = null;
  }

  loadMoviesFromLocalStorage(): void {
    const storedMovies = localStorage.getItem('addedMovies');
    if (storedMovies) {
      this.addedMovies = JSON.parse(storedMovies);
    }
  }

  onSubmit(): void {
    this.addMovie();
  }

  onSelectionChange(event: any) {
    const selectedOption = event.options.find((option: { selected: any; }) => option.selected);
    this.selectedMovie = selectedOption ? selectedOption.value : null;
  }

  getOptimizedImage(url: string): string {
    if (!url) return '';
    return url.replace(/_SX\d+/, '_SX60');
  }

  onDetailsFormSubmit(updatedData: any) {
    this.selectedMovie = updatedData;
    this.onSubmit();
  }

}