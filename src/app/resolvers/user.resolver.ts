import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from "../Auth/auth.service";
import { User } from "../@Models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserResolver {
  constructor(
    private authService: AuthService
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    this.authService.getNewUserTimeLeft().subscribe();
    return this.authService.getMe();
  }
}
