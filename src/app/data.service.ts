import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public chatTriggerSource = new BehaviorSubject('not open');
    currentMessage = this.chatTriggerSource.asObservable();

    public countryNameSource = new BehaviorSubject('United States');
    countryName = this.countryNameSource.asObservable();

    public countryIdSource = new BehaviorSubject('2');
    countryId = this.countryIdSource.asObservable();

    public timeoutStatusSource = new BehaviorSubject(0);
    timeoutStatus = this.timeoutStatusSource.asObservable();

    constructor() {
    }

    changeChatOpenStatus(message: string) {
        this.chatTriggerSource.next(message);
    }

    changeCountryName(countryName: string) {
        this.countryNameSource.next(countryName)
    }

    changeCountryId(countryId: string) {
        this.countryIdSource.next(countryId)
    }

    changeTimeOutStatus(isValid: number) {
        this.timeoutStatusSource.next(isValid)
    }

}
