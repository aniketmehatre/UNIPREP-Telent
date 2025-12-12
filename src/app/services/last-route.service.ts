import { Injectable } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class LastRouteService {
  private ignoredRoutes = [
    "/landing",
    "/login",
    "/register",
    "/privacy",
    "/blogs",
    "/certificates",
    "/enterprisepayment",
    "/forgot-password",
    "/setpassword",
    "/verification",
    "/logout",
  ];

  constructor(private router: Router, private http: HttpClient) {
    // 👀 Listen to all route changes
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        const currentRoute = event.urlAfterRedirects;
        console.log(currentRoute);
        if (currentRoute === "/") {
          return; // Skip saving root route
        }
        // 👀 Check if the route is not in the ignored list before
        // sending to backend
        if (
          !this.ignoredRoutes.some((route) => currentRoute.startsWith(route))
        ) {
          this.saveLastRoute(currentRoute);
        }
      });
  }

  private saveLastRoute(route: string) {
    this.http
      .post(environment.ApiUrl + "/updateLastUrl", { lastUrl: route })
      .subscribe({
        next: () => {},
        error: (err) => console.error("Error saving route:", err),
      });
  }
}
