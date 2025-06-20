import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError, finalize } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { AuthTokenService } from "../core/services/auth-token.service";
import { LocationService } from "../location.service";
import { Router } from "@angular/router";
import { DataService } from "../data.service";

// Cache for public routes check
const publicRoutesSet = new Set([
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
]);

// Cache for background requests
const backgroundRequestsSet = new Set([
  "country",
  "getuserdetails",
  "SendMailGlobalReport",
  "SubmoduleListForStudents",
  "StudentsSubmoduleQuestions",
  "getlatestfaqquestions",
  "googleapis",
  "getsubscriptiontimeleft"
]);

export const HttpErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const dataService = inject(DataService);
  const toast = inject(MessageService);
  const ngxService = inject(NgxUiLoaderService);
  const authTokenService = inject(AuthTokenService);
  const locationService = inject(LocationService);
  const currentUrl = window.location.href;
  const isPublicRoute = Array.from(publicRoutesSet).some(route => currentUrl.includes(route));
  const isBackgroundRequest = Array.from(backgroundRequestsSet).some(path => request.url.includes(path));
  const router = inject(Router)
  // Add auth token only for protected API requests
  if (request.url.includes(environment.ApiUrl) && !isPublicRoute) {
    const token = authTokenService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
    }
  }

  // Start loader only for non-background requests
  if (!isBackgroundRequest && !currentUrl.includes('modules')) {
    ngxService.startBackground();
  }

  return next(request).pipe(
    tap((res: any) => {
      if (res.status && !isBackgroundRequest) {
        ngxService.stopBackground();
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // if (authTokenService.isTokenValid() && error.status !== 0) {
      //   locationService.sessionEndApiCall().subscribe();
      // }
      if (error.status == 408) {
        dataService.loggedInAnotherDevice("block")
        return throwError(() => error);
      }
      if ((error.status === 500 || error.status === 401) && !isPublicRoute) {
        toast.add({
          severity: 'error',
          summary: 'Session Expired',
          detail: 'Please login again'
        });
        authTokenService.clearToken();
        router.navigate(['/login']);
      } else if (error.status === 422) {
        toast.add({
          severity: 'error',
          summary: 'Info',
          detail: error.error.message,
          life: 3000
        });
      } else if (error.status === 400) {
        toast.add({
          severity: 'error',
          summary: 'Unauthorized',
          detail: 'You are not authorized to access this resource',
          life: 3000
        });
      } else if (error instanceof Error && error.message.includes('timeout')) {
        toast.add({
          severity: 'error',
          summary: 'Request Timeout',
          detail: 'The server is taking too long to respond. Please try again.'
        });
      }

      if (!isBackgroundRequest) {
        ngxService.stopBackground();
      }

      return throwError(() => error);
    }),
    finalize(() => {
      if (!isBackgroundRequest) {
        ngxService.stopBackground();
      }
    })
  );
};
