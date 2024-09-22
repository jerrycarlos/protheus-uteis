import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private router: Router ) { }

  // tslint:disable-next-line: max-line-length
  headers = new HttpHeaders().set('', '');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  get(path: string): Observable<any> {
    return this.http.get<[]>(environment.urlApi + path, /*{ headers: this.headers }*/).pipe(
      catchError(this.handleError<[]>('get', path))
    );
  }

  getUrlApi(){
    return environment.urlApi;
  }

  post(path: string, body: any): Observable<[]> {
    return this.http.post<[]>(environment.urlApi + path, body, /*{ headers: this.headers}*/).pipe(
      catchError(this.handleError<[]>('post', path))
    );
  }

  delete(path: string): Observable<[]> {
    console.log(environment.urlApi + path)
    return this.http.delete<[]>(environment.urlApi + path, this.httpOptions).pipe(
      catchError(this.handleError<[]>('delete', path))
    );
  }

  private handleError<T>(operation = 'operation', path: string, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error.status);
      console.error(operation + ': ' + path, error);
      return throwError(error);
    };
  }

}
