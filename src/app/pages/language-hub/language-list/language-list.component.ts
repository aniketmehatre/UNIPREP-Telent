import {Component, OnInit} from '@angular/core';

import {Router} from "@angular/router";
import {LanguageHubService} from "../language-hub.service";
import {LanguageHubDataService} from "../language-hub-data.service";

@Component({
    selector: 'uni-language-list',
    templateUrl: './language-list.component.html',
    styleUrls: ['./language-list.component.scss']
})
export class LanguageListComponent implements OnInit {

    isSkeletonVisible: boolean = true;
    languageList: any
    restrict = false;
    languageImageUrl: any

    constructor(private languageHubService: LanguageHubService,
                private lhs:LanguageHubDataService,
                private router: Router) {
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
        this.languageHubService.getLanguageList().subscribe((_res) => {
            this.isSkeletonVisible = false
            this.languageList = _res.data
        });
    }

    onLanguageClick(data: any) {
        this.lhs.setDataLanguageName(data.language)
        this.lhs.setLanguageData(data.id)
        this.router.navigate([`/pages/language-hub/levels/${data.id}`]);
    }

}
