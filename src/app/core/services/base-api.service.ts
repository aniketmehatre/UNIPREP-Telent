import { HttpClient, HttpHeaders, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { AuthTokenService } from './auth-token.service';

interface HttpOptions {
  headers?: HttpHeaders;
  context?: HttpContext;
  observe?: 'body';
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable()
export class BaseApiService {
  protected readonly headers: HttpHeaders;

  constructor(
    protected http: HttpClient,
    protected authTokenService: AuthTokenService
  ) {
    this.headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  protected getAuthHeaders(): HttpHeaders {
    const token = this.authTokenService.getToken();
    if (!token) {
      console.debug('No auth token available');
      return this.headers;
    }

    return this.headers.set('Authorization', `Bearer ${token}`);
  }

  protected handleError(error: any) {
    console.error('API Error:', error);
    if (error.status === 401) {
      this.authTokenService.clearToken();
    }
    return throwError(() => error);
  }

  protected get<T>(url: string, options: HttpOptions = {}): Observable<T> {
    const requestOptions: HttpOptions = {
      ...options,
      headers: this.getAuthHeaders(),
      observe: 'body',
      responseType: 'json'
    };
    return this.http.get<T>(url, requestOptions).pipe(
      retry(1),
      timeout(30000),
      catchError(error => this.handleError(error))
    );
  }

  protected post<T>(url: string, body: any, options: HttpOptions = {}): Observable<T> {
    const requestOptions: HttpOptions = {
      ...options,
      headers: this.getAuthHeaders(),
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post<T>(url, body, requestOptions).pipe(
      retry(1),
      timeout(30000),
      catchError(error => this.handleError(error))
    );
  }

  protected put<T>(url: string, body: any, options: HttpOptions = {}): Observable<T> {
    const requestOptions: HttpOptions = {
      ...options,
      headers: this.getAuthHeaders(),
      observe: 'body',
      responseType: 'json'
    };
    return this.http.put<T>(url, body, requestOptions).pipe(
      retry(1),
      timeout(30000),
      catchError(error => this.handleError(error))
    );
  }

  protected delete<T>(url: string, options: HttpOptions = {}): Observable<T> {
    const requestOptions: HttpOptions = {
      ...options,
      headers: this.getAuthHeaders(),
      observe: 'body',
      responseType: 'json'
    };
    return this.http.delete<T>(url, requestOptions).pipe(
      retry(1),
      timeout(30000),
      catchError(error => this.handleError(error))
    );
  }
} 