import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DomainwhitlabelGuard  {
  private allowedDomains = ["*.uniprep.ai","dev-student.uniprep.ai", "uniprep.ai", "localhost"];
  private homePath = '/home';
  private loginPath = '/login';

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const currentDomain = window.location.hostname;
    const requestedPath = state.url;

    if (this.allowedDomains.includes(currentDomain)) {
      // Allow access to all routes if the domain is allowed
      return of(true);
    } else {
      // If the domain is not allowed, only prevent access to /home
      if (requestedPath === this.homePath) {
        this.router.navigate([this.loginPath]);
        return of(false);
      }
      // Allow access to other routes even if the domain is not allowed
      return of(true);
    }
  }
}

