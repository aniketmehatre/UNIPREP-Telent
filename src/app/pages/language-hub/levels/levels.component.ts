import {Component, OnInit} from '@angular/core';
import {LanguageHubService} from "../language-hub.service";
import {Router} from "@angular/router";
import {environment} from "@env/environment.prod";

@Component({
    selector: 'uni-levels',
    templateUrl: './levels.component.html',
    styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {

    isSkeletonVisible: boolean = true;
    languageTypeList: any
    languageImageUrl: any

    constructor(private languageHubService: LanguageHubService, private router: Router) {
        this.languageImageUrl = environment.imageUrl
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
        this.languageHubService.getLanguageTypeList().subscribe((_res) => {
            console.log(_res)
            this.isSkeletonVisible = false
            this.languageTypeList = _res.data
        });
    }

    onLanguageTypeClick(languageTypeId: any) {
        this.router.navigate([`/pages/language-hub/category`]);
    }

}
