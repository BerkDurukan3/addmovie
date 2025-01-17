import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { MovieSearchComponent } from './movie-search/movie-search.component';
import { MovieUpdateComponent } from './movie-update/movie-update.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'search', component: MovieSearchComponent, canActivate: [AuthGuard] },
  { path: 'movie-update/:id', component: MovieUpdateComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}