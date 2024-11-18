import {Component, OnInit} from '@angular/core';

import {Router} from "@angular/router";
import {LanguageHubService} from "../language-hub.service";
import {LanguageHubDataService} from "../language-hub-data.service";
import { PageFacadeService } from '../../page-facade.service';
import {LanguageArrayGlobalService} from "../language-array-global.service";

@Component({
    selector: 'uni-language-list',
    templateUrl: './language-list.component.html',
    styleUrls: ['./language-list.component.scss']
})
export class LanguageListComponent implements OnInit {

    isSkeletonVisible: boolean = true;
    languageList: any
    restrict = false;
    totalQuestionCount: any
    page: number = 1
    perpage: number = 25


    constructor(private languageHubService: LanguageHubService,
                private lhs:LanguageHubDataService, private languageArrayGlobalService: LanguageArrayGlobalService,
                private router: Router, private pageFacade: PageFacadeService) {
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
       this.init()
    }

    init(){
        let req = {
            perpage: this.perpage,
            page: this.page
        }
        this.languageHubService.getLanguageList(req).subscribe((_res) => {
            this.isSkeletonVisible = false
            this.languageList = _res.data
            this.totalQuestionCount = _res.count
        });
        this.languageArrayGlobalService.clearAll()
    }

    onLanguageClick(data: any) {
        this.languageArrayGlobalService.addItem(data.language)
        this.lhs.setDataLanguageName(data.language)
        this.lhs.setLanguageData(data.id)
        this.lhs.setLanguageCode(data.languagecode)
        this.router.navigate([`/pages/language-hub/levels/${data.id}`]);
    }

    paginatePost(event: any) {
        console.log('comess')
        this.page = event.page + 1;
        this.perpage = event.rows;
        this.init();
    }

    openVideoPopup(videoLink: string) {
        this.pageFacade.openHowitWorksVideoPopup(videoLink);
    }

}
