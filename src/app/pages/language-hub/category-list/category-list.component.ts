import {Component, OnInit} from '@angular/core';
import {LanguageHubService} from "../language-hub.service";
import {Router} from "@angular/router";
import {environment} from "@env/environment.prod";
import {Location} from "@angular/common";
import {LanguageHubDataService} from "../language-hub-data.service";
import { MessageService } from 'primeng/api';

@Component({
    selector: 'uni-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

    isSkeletonVisible: boolean = true;
    categoryList: any
    restrict = false;
    languageImageUrl: any
    selectedLanguageId: any
    selectedLanguageType: any

    constructor(private languageHubService: LanguageHubService, private lhs:LanguageHubDataService,
                private router: Router, private toast: MessageService,
                private location: Location) {
        this.languageImageUrl = environment.imageUrl
        this.lhs.data$.subscribe((data) => {
            this.selectedLanguageId = data
        })
        this.lhs.dataLanguageType$.subscribe((data) => {
            this.selectedLanguageType = data
        })
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
        if (!this.selectedLanguageId || !this.selectedLanguageType) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'No Data Found' });

            this.location.back();
        }

        let req = {
            languageid: this.selectedLanguageId,
            languagetype: this.selectedLanguageType
        }
        this.languageHubService.getCategoryList(req).subscribe((_res) => {
            this.isSkeletonVisible = false
            this.categoryList = _res.data
        },
        (error) => {
                // Handle error
                this.location.back();
                console.error('Error:', error);
            });
    }

    onCategoryClick(categoryId: any) {
        this.router.navigate([`/pages/language-hub/question-list/${categoryId}`]);
    }
}
