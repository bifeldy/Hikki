import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class JikanService {

  constructor(
    private http: HttpClient,
    private gs: GlobalService
  ) {
  }

  getAnime(animeId: number): any {
    this.gs.log('[JIKAN_GET_ANIME_DETAIL]', animeId);
    return this.http.get(`${environment.sniffCors}${environment.jikanMAL}/anime/${animeId}`).pipe(catchError(err => throwError(err)));
  }

  getSeasonalAnime(year: number, season: string): any {
    this.gs.log('[JIKAN_GET_ANIME_SEASONAL]', `${year}/${season}`);
    return this.http.get(`${environment.sniffCors}${environment.jikanMAL}/season/${year}/${season}`).pipe(catchError(err => throwError(err)));
  }

}