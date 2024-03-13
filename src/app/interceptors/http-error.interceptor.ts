import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Router } from "@angular/router";
import { log } from "console";
import { DataService } from "../data.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: MessageService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private dataService: DataService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // !request.url.includes('StudentFullQuestionData') &&
    // !request.url.includes('SubmoduleListForStudents')

    let currentUrl = window.location.href;

    if (
      !request.url.includes("country") &&
      !request.url.includes("getuserdetails") &&
      !request.url.includes("SendMailGlobalReport") &&
      !request.url.includes("SubmoduleListForStudents") &&
      !request.url.includes("StudentsSubmoduleQuestions") &&
      !request.url.includes("StudentFullQuestionData") &&
      !request.url.includes("getlatestfaqquestions")
    ) {
      if(!currentUrl.includes('modules')){
        this.ngxService.start();
      }
    }
    return next.handle(request).pipe(
      tap((res: any) => {
        if (res.status) {
          this.ngxService.stop();
        }
      }),
      catchError((err: any) => {
        // if(err.error.message.includes('Call to a member function tokens() on null')){
        //   window.sessionStorage.clear();
        //   localStorage.clear();
        //   this.router.navigateByUrl("/login");
        // }
        const msg =
          err?.error?.message ||
          err?.error?.error?.message ||
          err?.message ||
          "Something wrong please try again!";
        // this.toastr.add({severity: 'error', summary: 'Error', detail: msg});
        this.ngxService.stop();
        if (err?.status === 401) {
          window.sessionStorage.clear();
          localStorage.clear();
          if (!msg.includes("Unauthorized")) {
            this.toastr.add({
              severity: "error",
              summary: "Error",
              detail: msg,
            });
          }
          this.router.navigateByUrl("/login");
        }
        if (err?.status === 408) {
          // window.sessionStorage.clear();
          // localStorage.clear();
          this.dataService.loggedInAnotherDevice("block");
          //this.router.navigateByUrl('/login');
          //const msg = 'You have logged into the portal from another device , Please log back in from this device to use the portal again.'
          //this.toastr.add({severity: 'error', summary: 'Error', detail: "You have logged into the portal from another device , Please log back in from this device to use the portal again."});
          //  console.log("bla");
        }
        return throwError(() => new Error(msg));
      })
    );
  }
}
