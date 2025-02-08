import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError, timeout, retry } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { DataService } from "../data.service";

export const HttpErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const toastr = inject(MessageService);
  const ngxService = inject(NgxUiLoaderService);
  const router = inject(Router);
  const dataService = inject(DataService);
  
  let currentUrl = window.location.href;

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
        switch (error.status) {
          case 401:
            window.sessionStorage.clear();
            localStorage.clear();
            if (!error.error?.message?.includes("Unauthorized")) {
              toastr.add({
                severity: "error",
                summary: "Error",
                detail: error.error?.message || 'Unauthorized access'
              });
            }          
            router.navigateByUrl("/login");
            break;
          case 408:
            dataService.loggedInAnotherDevice("block");
            errorMessage = 'Request timed out. Please try again.';
            break;
          case 422:
            if (error.error?.message?.includes("Unprocessable")) {
              toastr.add({
                severity: "error",
                summary: "Error",
                detail: 'No Data Found.'
              });
            }
            break;
          default:
            errorMessage = error.error?.message || error.message || errorMessage;
        }
      }
      
      return throwError(() => new Error(errorMessage));
    })
  );
};
