import {Component, OnInit} from '@angular/core';
import {LanguageHubService} from "../language-hub.service";
import {Router} from "@angular/router";
import {environment} from "@env/environment.prod";
import {LanguageHubDataService} from "../language-hub-data.service";
import {Location} from "@angular/common";
import { PageFacadeService } from '../../page-facade.service';
import {LanguageArrayGlobalService} from "../language-array-global.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'uni-levels',
    templateUrl: './levels.component.html',
    styleUrls: ['./levels.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class LevelsComponent implements OnInit {

    isSkeletonVisible: boolean = true;
    languageTypeList: any
    selectedLanguageId: any
    selectedLanguageName: string =  "";
    
    constructor(private languageHubService: LanguageHubService, private lhs:LanguageHubDataService, private router: Router,
                private location: Location, private pageFacade:PageFacadeService, public authService: AuthService,
                private languageArrayGlobalService: LanguageArrayGlobalService) {
        this.lhs.data$.subscribe((data) => {
            this.selectedLanguageId = data
        });

        this.lhs.dataLanguageName$.subscribe((data) => {
            this.selectedLanguageName = data
        });
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
        this.languageHubService.getLanguageTypeList(this.selectedLanguageId).subscribe((_res) => {
            this.isSkeletonVisible = false
            this.languageTypeList = _res.data
        });
    }

    getFormattedValues(): string {
        return this.languageArrayGlobalService.getItems().join(' -> ');
    }

    goToHome(event: any) {
        this.languageArrayGlobalService.removeItem(this.languageArrayGlobalService.getItems().length - 1);
        this.location.back();
    }

    onLanguageTypeClick(languageTypeId: any, sub: any) {
        this.languageArrayGlobalService.addItem(sub.type)
        this.lhs.setDataLanguageTypeName(sub.type)
        this.lhs.setDataLanguageType(languageTypeId)
        this.router.navigate([`/pages/language-hub/category`]);
    }

    openVideoPopup(videoLink: string) {
        this.pageFacade.openHowitWorksVideoPopup(videoLink);
    }
}
