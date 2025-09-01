import { Injectable } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService {


  public freeTrailExpiredStatus$ = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) { }


}
