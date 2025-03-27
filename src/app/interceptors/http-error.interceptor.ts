import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError, finalize } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { DataService } from "../data.service";
import { environment } from "../../environments/environment";
import { AuthTokenService } from "../core/services/auth-token.service";
import { LocationService } from "../location.service";

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
  const toastr = inject(MessageService);
  const ngxService = inject(NgxUiLoaderService);
  const authTokenService = inject(AuthTokenService);
  const locationService = inject(LocationService);
  const currentUrl = window.location.href;
  const isPublicRoute = Array.from(publicRoutesSet).some(route => currentUrl.includes(route));
  const isBackgroundRequest = Array.from(backgroundRequestsSet).some(path => request.url.includes(path));

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
      const token=authTokenService.getToken()
      if(token){
        locationService.sessionEndApiCall().subscribe((data: any) => {})
      }
      if (error.status === 401 && !isPublicRoute) {
        authTokenService.clearToken();
        toastr.add({
          severity: 'error',
          summary: 'Session Expired',
          detail: 'Please login again'
        });
      } else if (error instanceof Error && error.message.includes('timeout')) {
        toastr.add({
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
