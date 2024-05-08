import {Component, OnInit} from '@angular/core';
import {LanguageHubService} from "../language-hub.service";
import {Router} from "@angular/router";
import {environment} from "@env/environment.prod";
import {Location} from "@angular/common";

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

    constructor(private lhs: LanguageHubService, private languageHubService: LanguageHubService, private router: Router,
                private location: Location) {
        this.languageImageUrl = environment.imageUrl
        this.lhs.data$.subscribe((data) => {
            this.selectedLanguageId = data
        })
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
        if (!this.selectedLanguageId) {
            this.location.back();
        }
        this.languageHubService.getCategoryList().subscribe((_res) => {
            this.isSkeletonVisible = false
            this.categoryList = _res.data
        });
    }

    onCategoryClick(categoryId: any) {
        this.router.navigate([`/pages/language-hub/question-list`]);
    }
}
