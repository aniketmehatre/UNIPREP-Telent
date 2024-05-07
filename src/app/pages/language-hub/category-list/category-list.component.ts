import { Component, OnInit } from '@angular/core';
import {LanguageHubService} from "../language-hub.service";
import {Router} from "@angular/router";
import {environment} from "@env/environment.prod";

@Component({
  selector: 'uni-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  constructor(private lhs: LanguageHubService, private languageHubService: LanguageHubService, private router: Router) {
    this.languageImageUrl = environment.imageUrl
    this.lhs.data$.subscribe((data) => {
      console.log(data);
    })
  }
  isSkeletonVisible: boolean = true;
  categoryList: any
  restrict = false;
  languageImageUrl: any

  loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

  ngOnInit(): void {
    this.languageHubService.getLanguageList().subscribe((_res) => {
      this.isSkeletonVisible = false
      this.categoryList = _res.languages
    });
  }

  onCategoryClick(languageId: any) {
    this.languageHubService.setLanguageData(languageId)
    this.router.navigate([`/pages/language-hub/levels/${languageId}`]);
  }
}
