import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError, timeout, retry, finalize } from "rxjs";
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
) => {
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
      try {
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
      } catch (error) {
        console.error('Interceptor - Error setting auth header:', error);
      }
    } else {
      console.debug('Interceptor - No token available');
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
      
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        console.debug('Interceptor - 401 error detected');
        
        // Clear token and redirect to login
        const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
        localStorage.removeItem(tokenKey);
        
        if (!currentUrl.includes('login')) {
          router.navigate(['/login']);
        }
        
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
