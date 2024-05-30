import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject } from 'rxjs';
import {PagesService} from './store/pages.service';

@Injectable({
    providedIn: 'root'
})
export class PageFacadeService {
    constructor(
        private pageService: PagesService
    ) {
    }

    sideBarState$(): Observable<boolean> {
        return this.pageService.selectSideBarState();
    }

    togleSideBar(state: boolean) {
        this.pageService.toggleSideBar(state);
    }

    
    public videoPopupTrigger = new BehaviorSubject<any>("");
    videoPopupTrigger$ = this.videoPopupTrigger.asObservable();

    openHowitWorksVideoPopup(data: any) {
        this.videoPopupTrigger.next(data);
    }
    
}
