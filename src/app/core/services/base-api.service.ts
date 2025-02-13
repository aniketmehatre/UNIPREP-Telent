import { HttpClient, HttpHeaders, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError, of, timer, race, forkJoin } from 'rxjs';
import { catchError, shareReplay, tap, map, timeout } from 'rxjs/operators';
import { AuthTokenService } from './auth-token.service';

interface HttpOptions {
  headers?: HttpHeaders;
  context?: HttpContext;
  observe?: 'body';
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  skipCache?: boolean;
  customTimeout?: number;
}

@Injectable()
export class BaseApiService {
  protected readonly headers: HttpHeaders;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 300000; // 5 minutes cache
  private readonly DEFAULT_TIMEOUT = 8000; // 8 seconds default timeout
  private readonly DASHBOARD_TIMEOUT = 5000; // 5 seconds for dashboard endpoints

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
    if (error.status === 401) {
      this.authTokenService.clearToken();
    }
    return throwError(() => error);
  }

  private getCacheKey(url: string): string {
    return `${url}`;
  }

  private getFromCache<T>(key: string): Observable<T> | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return of(cached.data);
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private isDashboardEndpoint(url: string): boolean {
    return url.includes('/dashboard') || url.includes('/getuserdetails');
  }

  private getTimeoutDuration(url: string, customTimeout?: number): number {
    if (customTimeout) return customTimeout;
    return this.isDashboardEndpoint(url) ? this.DASHBOARD_TIMEOUT : this.DEFAULT_TIMEOUT;
  }

  protected get<T>(url: string, options: HttpOptions = {}): Observable<T> {
    const requestOptions: HttpOptions = {
      ...options,
      headers: this.getAuthHeaders(),
      observe: 'body',
      responseType: 'json'
    };

    if (!options.skipCache) {
      const cacheKey = this.getCacheKey(url);
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) return cached;
    }

    const timeoutDuration = this.getTimeoutDuration(url, options.customTimeout);

    return this.http.get<T>(url, requestOptions).pipe(
      timeout(timeoutDuration),
      tap(response => {
        if (!options.skipCache) {
          this.setCache(this.getCacheKey(url), response);
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
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

    const timeoutDuration = this.getTimeoutDuration(url, options.customTimeout);

    return this.http.post<T>(url, body, requestOptions).pipe(
      timeout(timeoutDuration),
      shareReplay({ bufferSize: 1, refCount: true }),
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

    const timeoutDuration = this.getTimeoutDuration(url, options.customTimeout);

    return this.http.put<T>(url, body, requestOptions).pipe(
      timeout(timeoutDuration),
      shareReplay({ bufferSize: 1, refCount: true }),
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

    const timeoutDuration = this.getTimeoutDuration(url, options.customTimeout);

    return this.http.delete<T>(url, requestOptions).pipe(
      timeout(timeoutDuration),
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError(error => this.handleError(error))
    );
  }
} 