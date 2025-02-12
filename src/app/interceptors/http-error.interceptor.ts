import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError, timeout, retry, finalize } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { DataService } from "../data.service";
import { environment } from "../../environments/environment";
import { AuthTokenService } from "../core/services/auth-token.service";

export const HttpErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const toastr = inject(MessageService);
  const ngxService = inject(NgxUiLoaderService);
  const router = inject(Router);
  const dataService = inject(DataService);
  const authTokenService = inject(AuthTokenService);
  
  let currentUrl = window.location.href;

  // Public routes that don't need authentication
  const publicRoutes = [
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

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => currentUrl.includes(route));

  // Add auth token only for protected API requests
  if (request.url.includes(environment.ApiUrl) && !isPublicRoute) {
    const token = authTokenService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    }
  }

  // Start loader for non-background requests
  if (
    !request.url.includes("country") &&
    !request.url.includes("getuserdetails") &&
    !request.url.includes("SendMailGlobalReport") &&
    !request.url.includes("SubmoduleListForStudents") &&
    !request.url.includes("StudentsSubmoduleQuestions") &&
    !request.url.includes("getlatestfaqquestions") &&
    !request.url.includes("googleapis") &&
    !request.url.includes("getsubscriptiontimeleft")
  ) {
    if(!currentUrl.includes('modules')){
      ngxService.startBackground();
    }
  }

  return next(request).pipe(
    timeout(30000), // 30 second timeout
    retry(2), // Retry failed requests up to 2 times
    tap((res: any) => {
      if (res.status) {
        ngxService.stopBackground();
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);
      
      // Handle authentication errors only for protected routes
      if (error.status === 401 && !isPublicRoute) {
        authTokenService.clearToken(); // This will also handle navigation
        
        toastr.add({
          severity: 'error',
          summary: 'Session Expired',
          detail: 'Please login again'
        });
      }
      
      // Stop loader
      ngxService.stopBackground();
      
      return throwError(() => error);
    }),
    finalize(() => {
      ngxService.stopBackground();
    })
  );
};
