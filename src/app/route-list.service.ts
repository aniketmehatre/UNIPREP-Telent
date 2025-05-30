import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteListService {
  constructor(private router: Router) {}

  getAllFlattenedRoutes(): any[] {
    const allRoutes: any[] = [];
    const visited = new Set<Route>(); // Prevent infinite loops

    const flatten = (routes: Route[], parentPath = '') => {
      for (const route of routes) {
        if (visited.has(route)) continue;
        visited.add(route);

        const currentPath = route.path || '';
        const fullPath = (parentPath + '/' + currentPath).replace(/\/+/g, '/');

        const routeInfo: any = {
          path: fullPath,
        };

        allRoutes.push(routeInfo);

        // Normal child routes
        if (route.children) {
          flatten(route.children, fullPath);
        }

        // Lazy-loaded module children
        if ((route as any)._loadedRoutes) {
          flatten((route as any)._loadedRoutes, fullPath);
        }
      }
    };

    flatten(this.router.config);
    return allRoutes;
  }
}
