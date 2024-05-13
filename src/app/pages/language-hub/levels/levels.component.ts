import {Component, OnInit} from '@angular/core';
import {LanguageHubService} from "../language-hub.service";
import {Router} from "@angular/router";
import {environment} from "@env/environment.prod";
import {LanguageHubDataService} from "../language-hub-data.service";
import {Location} from "@angular/common";

@Component({
    selector: 'uni-levels',
    templateUrl: './levels.component.html',
    styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {

    isSkeletonVisible: boolean = true;
    languageTypeList: any

    constructor(private languageHubService: LanguageHubService, private lhs:LanguageHubDataService, private router: Router,
                private location: Location) {
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
        this.languageHubService.getLanguageTypeList().subscribe((_res) => {
            this.isSkeletonVisible = false
            this.languageTypeList = _res.data
        });
    }

    goToHome(event: any) {
        this.location.back();
    }

    onLanguageTypeClick(languageTypeId: any) {
        this.lhs.setDataLanguageType(languageTypeId)
        this.router.navigate([`/pages/language-hub/category`]);
    }

}
