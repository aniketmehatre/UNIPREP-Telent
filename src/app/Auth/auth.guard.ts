import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    private lastCheck: number = 0;
    private lastResult: boolean | UrlTree | null = null;
    private readonly CACHE_DURATION = 5000; // 5 seconds cache
    private readonly publicRoutes = [
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

    constructor(
        private router: Router,
        private authTokenService: AuthTokenService
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Check if the route is public
        if (this.publicRoutes.some(route => state.url.startsWith(route))) {
            return true;
        }

        const currentTime = Date.now();
        if (currentTime - this.lastCheck < this.CACHE_DURATION && this.lastResult !== null) {
            return this.lastResult;
        }
        try {
            if (!this.authTokenService.isTokenValid()) {
                this.lastCheck = currentTime;
                this.lastResult = this.router.createUrlTree(['/login']);
                return this.lastResult;
            }

            this.lastCheck = currentTime;
            this.lastResult = true;
            return true;
        } catch (error) {
            console.error('AuthGuard - Error during route guard:', error);
            this.lastCheck = currentTime;
            this.lastResult = this.router.createUrlTree(['/login']);
            return this.lastResult;
        }
    }

    canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return true; // Allow lazy loading of modules
    }

}
