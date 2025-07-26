import { Injectable } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService {

  premiumPlanMenu: string[] = ['Career Tools', 'Travel Tools', 'Education Tools', 'Founders Tool'];
  public hasUserSubscriptionNew$ = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) { }

  isInvalidSubscriptionNew(module: string): boolean {
    let planExpired: boolean = false;
    if (this.authService._userSubscrition?.time_left?.plan === "expired" ||
      this.authService._userSubscrition?.time_left?.plan === "subscription_expired") {
      planExpired = true;
    }
    return planExpired;
  }
}
