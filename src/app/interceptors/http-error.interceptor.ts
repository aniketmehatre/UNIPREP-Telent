import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
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
    tap((res: any) => {
      if (res.status) {
        ngxService.stopBackground();
      }
    }),
    catchError((err: any) => {
      const msg =
        err?.error?.message ||
        err?.error?.error?.message ||
        err?.message ||
        "Something wrong please try again!";
      ngxService.stopBackground();
      
      if (err?.status === 401) {
        window.sessionStorage.clear();
        localStorage.clear();
        if (!msg.includes("Unauthorized")) {
          toastr.add({
            severity: "error",
            summary: "Error",
            detail: msg,
          });
        }          
        router.navigateByUrl("/login");
      }
      if (err?.status === 422) {
        if (msg.includes("Unprocessable")) {
          toastr.add({
            severity: "error",
            summary: "Error",
            detail: 'No Data Found.',
          });
        }
      }
      if (err?.status === 408) {
        dataService.loggedInAnotherDevice("block");
      }
      return throwError(() => new Error(msg));
    })
  );
};
