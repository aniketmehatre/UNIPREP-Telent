import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {LocalStorageService} from 'ngx-localstorage';
import { JwtHelperService } from "@auth0/angular-jwt";
import { DataService } from '../data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(
    private storage: LocalStorageService,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('AuthGuard - Checking route:', state.url);
    
    try {
      // Use authService to get token instead of direct storage access
      const token = this.authService.getToken();
      console.log('AuthGuard - Token check result:', !!token);
      
      if (!token) {
        console.log('AuthGuard - No token, redirecting to login');
        return this.router.createUrlTree(['/login']);
      }

      const helper = new JwtHelperService();
      const isExpired = helper.isTokenExpired(token);
      console.log('AuthGuard - Token expiration check:', isExpired ? 'Expired' : 'Valid');

      if (isExpired) {
        console.log('AuthGuard - Token expired, redirecting to login');
        return this.router.createUrlTree(['/login']);
      }

      // Token is valid
      console.log('AuthGuard - Access granted to:', state.url);
      return true;
    } catch (error) {
      console.error('AuthGuard - Error during route guard:', error);
      return this.router.createUrlTree(['/login']);
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
  }
}
