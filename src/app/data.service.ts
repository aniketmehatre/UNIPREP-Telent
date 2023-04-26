import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public chatTriggerSource = new BehaviorSubject('not open');
  currentMessage = this.chatTriggerSource.asObservable();

  constructor() { }

  changeChatOpenStatus(message: string) {
    this.chatTriggerSource.next(message);
  }

}
