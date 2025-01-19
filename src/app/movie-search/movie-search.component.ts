import { Component, inject, OnInit } from '@angular/core';
import { OmdbService } from '../omdb.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Movie } from '../models/movie.model';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatSnackBar} from '@angular/material/snack-bar'
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-movie-search',
  imports: [FormsModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatListModule, MovieDetailsComponent],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
  providers: [OmdbService],

})
export class MovieSearchComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);
  private intersectionObserver!: IntersectionObserver;

  searchQuery: string = '';
  movies: Movie[] = [];
  selectedMovie: Movie | null | undefined;
  addedMovies: Movie[] = [];

  page: number = 1;
  pageSize: number = 10;
  loading: boolean = false;

  private searchSubject = new Subject<string>();

  constructor(private omdbService: OmdbService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.setupInfiniteScroll();
    }, 500);
    this.loadMoviesFromLocalStorage();
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query) {
          this.movies = [];
          return [];
        }
        this.loading = true;
        this.page = 1;
        return this.omdbService.searchMovies(query, this.page, this.pageSize);
      })
    ).subscribe(data => {
      data.Search.map((item: { isLoading: boolean; }) => item.isLoading = true);
      this.movies = [...data.Search || []];
      this.loading = false;
    });
  }

  setupInfiniteScroll() {
    const sentinel = document.querySelector('#sentinel') as Element;
    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.searchQuery) {
        this.page++;
        this.loadMovies();
      }
    });

    this.intersectionObserver.observe(sentinel);
  }

  loadMovies() {
    if (!this.loading) {
      this.loading = true;
      this.omdbService.searchMovies(this.searchQuery, this.page, this.pageSize).subscribe(data => {
        data.Search.map((item: { isLoading: boolean; }) => item.isLoading = true);
        this.movies = [...this.movies, ...data.Search || []];
        this.loading = false;
      });
    }
  }

  onImageLoad(movie: Movie) {
    movie.isLoading = false;
  }

  onImageError(event: Event, movie: Movie) {
    movie.isLoading = false;
    const element = event.target as HTMLImageElement;
    element.src = 'img.png'; 
  }

  onSearch(): void {
    this.selectedMovie = null;
    this.searchSubject.next(this.searchQuery);
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

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}