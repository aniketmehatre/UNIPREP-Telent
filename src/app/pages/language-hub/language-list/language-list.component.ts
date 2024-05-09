import {Component, OnInit} from '@angular/core';
import {LanguageHubService} from "../language-hub.service";
import {environment} from "@env/environment.prod";
import {Router} from "@angular/router";

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

    constructor(private languageHubService: LanguageHubService, private router: Router) {
        this.languageImageUrl = environment.imageUrl
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
        this.languageHubService.getLanguageList().subscribe((_res) => {
            this.isSkeletonVisible = false
            this.languageList = _res.languages
        });
    }

    onLanguageClick(data: any) {
        this.languageHubService.setDataLanguageName(data.language)
        this.languageHubService.setLanguageData(data.id)
        this.router.navigate([`/pages/language-hub/levels/${data.id}`]);
    }

}
