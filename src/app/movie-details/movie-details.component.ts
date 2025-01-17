import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Movie } from '../models/movie.model';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { NumberRangeDirective } from '../number-range-directive.directive';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  imports: [FormsModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatListModule, NumberRangeDirective],
})
export class MovieDetailsComponent {
  @Input() type!: string | 'update' | 'search';
  @Input() selectedMovie: Movie | undefined | null;
  @Output() formSubmit = new EventEmitter<any>();
  
  movieForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.movieForm = this.fb.group({
      Title: [''],
      Poster: [''],
      rating: [''],
      imdbID: [''],
      Type: [''],
      Year: [''],
      addedDate: ['']
    });
  }

  ngOnChanges() {
    if (this.selectedMovie) {
      this.movieForm.patchValue({
        Title: this.selectedMovie.Title,
        Poster: this.selectedMovie.Poster,
        rating: this.selectedMovie.rating || '',
        imdbID: this.selectedMovie.imdbID,
        Type: this.selectedMovie.Type,
        Year: this.selectedMovie.Year,
        addedDate: this.selectedMovie.addedDate,
      });
    }
  }

  onSubmit() {
    if (this.movieForm.valid) {
      this.formSubmit.emit(this.movieForm.value);
    }
  }
}