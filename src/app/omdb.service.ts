import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {

  private apiUrl = 'http://www.omdbapi.com/?apikey=cdaf25ed';

  constructor(private http: HttpClient) { }

  searchMovies(query: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiUrl}&s=${query}&page=${page}`;
    return this.http.get<any>(url);
  }
}