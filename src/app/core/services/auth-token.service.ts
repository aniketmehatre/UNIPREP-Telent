import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { environment } from '@env/environment';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private readonly TOKEN_EXPIRY_THRESHOLD = 5 * 60; // 5 minutes in seconds
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private storage: LocalStorageService,
    private router: Router
  ) {
    // Initialize token from storage
    this.initializeToken();
  }

  initializeToken(): void {
    const token = this.storage.get<string>(environment.tokenKey);
    if (token && this.isTokenValid(token)) {
      this.tokenSubject.next(token);
    } else {
      this.clearToken(false); // Don't force redirect on initialization
    }
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  getTokenAsObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  setToken(token: string): void {
    if (!token) {
      console.warn('Attempted to save empty token');
      return;
    }

    try {
      const cleanToken = this.cleanToken(token);
      if (this.isTokenValid(cleanToken)) {
        this.storage.set(environment.tokenKey, cleanToken);
        this.tokenSubject.next(cleanToken);
      } else {
        throw new Error('Invalid token format or expired');
      }
    } catch (error) {
      console.error('Error saving token:', error);
      this.clearToken(false);
    }
  }

  clearToken(shouldRedirect: boolean = true): void {
    this.storage.remove(environment.tokenKey);
    this.tokenSubject.next(null);

    // Only redirect to login if explicitly requested and current route is not public
    if (shouldRedirect) {
      const currentUrl = this.router.url;
      const publicRoutes = [
        '',
        '/',
        '/landing',
        '/login',
        '/register',
        '/privacy',
        '/blogs',
        '/certificates',
        '/enterprisepayment',
        '/forgot-password',
        '/setpassword',
        '/verification'
      ];
      const isPublicRoute = publicRoutes.some(route => currentUrl.startsWith(route));

      if (!isPublicRoute) {
        this.router.navigate(['/login']);
      }
    }
  }

  isTokenValid(token?: string): boolean {
    try {
      const tokenToCheck = token || this.getToken();
      if (!tokenToCheck) return false;

      const decoded: any = jwtDecode(tokenToCheck);
      const currentTime = Math.floor(Date.now() / 1000);

      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  isTokenNearExpiry(): boolean {
    try {
      const token = this.getToken();
      if (!token) return true;

      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      return (decoded.exp - currentTime) <= this.TOKEN_EXPIRY_THRESHOLD;
    } catch {
      return true;
    }
  }

  private cleanToken(token: string): string {
    return token.replace(/['"]+/g, '').trim();
  }
} 