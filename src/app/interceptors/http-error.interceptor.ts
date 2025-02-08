import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError, timeout, retry } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { DataService } from "../data.service";
import { environment } from "../../environments/environment";
import { NGX_LOCAL_STORAGE_CONFIG } from "ngx-localstorage";

const ngxLocalstorageConfiguration = NGX_LOCAL_STORAGE_CONFIG as unknown as { prefix: string, delimiter: string };

export const HttpErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const toastr = inject(MessageService);
  const ngxService = inject(NgxUiLoaderService);
  const router = inject(Router);
  const dataService = inject(DataService);
  
  let currentUrl = window.location.href;

  // Add auth token to all API requests
  if (request.url.includes(environment.ApiUrl)) {
    const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
    const token = localStorage.getItem(tokenKey);
    
    console.debug('Interceptor - URL:', request.url);
    console.debug('Interceptor - Token exists:', !!token);
    
    if (token) {
      // Clean the token
      const cleanToken = token.replace(/['"]+/g, '').trim();
      
      // Only add token if it's not already in the headers
      if (!request.headers.has('Authorization')) {
        request = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${cleanToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        console.debug('Interceptor - Added auth header');
      } else {
        console.debug('Interceptor - Auth header already exists');
      }
    } else {
      console.debug('Interceptor - No token available');
    }
  }

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
      ngxService.stopBackground();
      
      let errorMessage = 'An error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        if (error.status === 401) {
          console.debug('Interceptor - 401 error, clearing token and redirecting to login');
          // Clear tokens on 401
          localStorage.removeItem(environment.tokenKey);
          const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
          localStorage.removeItem(tokenKey);
          
          errorMessage = 'Authentication failed. Please login again.';
          router.navigate(['/login']);
        } else if (error.status === 408) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.error?.message || 'Server error occurred';
        }
      }

      toastr.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });

      return throwError(() => error);
    })
  );
};
