import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of, from } from 'rxjs';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

//HTTP communication import
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api
  

  constructor(
    private http: HttpClient,
    private messageService : MessageService
  ) { }

  getHeroes() : Observable<Hero[]> {
    this.messageService.addMessage('Hero service: heroes fetched.')
    return this.http.get<Hero[]>(this.heroesUrl)
                .pipe(               
                  tap(_=> this.log('fetched heroes')),
                  catchError(this.handleError<Hero[]>('getHeroes', []))
                );
  }

  getHero(id: number): Observable<Hero> {
    
    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero with id=${id}`)),
      catchError(this.handleError<Hero>(`get hero id=${id}`))
    );
  }

  updateHero(hero : Hero) : Observable<any> {
    return this.http.put<any>(this.heroesUrl, hero, httpOptions).pipe(
      tap(_=>this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>(`update hero id=${hero.id}`))
      );
  }

  addHero(value : Hero) : Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, value, httpOptions)
      .pipe(
        tap((newHero : Hero) => this.log(`added hero with name ${newHero.name}`)),
        catchError(this.handleError<Hero>('add hero'))
      );

  }

  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted hero id=${id}`)),
            catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.addMessage(`HeroService: ${message}`);
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
    
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
    
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

    

}
