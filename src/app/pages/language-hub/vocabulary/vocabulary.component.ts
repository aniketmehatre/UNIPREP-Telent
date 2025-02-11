import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageArrayGlobalService } from '../language-array-global.service';
import { PageFacadeService } from '../../page-facade.service';
import {Location} from "@angular/common";
import { LanguageHubService } from '../language-hub.service';
import { FormsModule } from "@angular/forms";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { CarouselModule } from "primeng/carousel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";

@Component({
    selector: 'app-vocabulary',
    templateUrl: './vocabulary.component.html',
    styleUrls: ['./vocabulary.component.scss'],
    standalone: true,
    imports: [CommonModule,FormsModule, SkeletonModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule]
})
export class VocabularyComponent implements OnInit {
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  searchTerm: string = '';
  isPlaying1: boolean = false;
  words: any;

  groupedWords: { letter: string; words: { word: string; translation: string }[] }[] = [];

  constructor(private languageArrayGlobalService: LanguageArrayGlobalService,
    private pageFacade: PageFacadeService, private location: Location,
    private languageHubService: LanguageHubService
  ) { }

  getFormattedValues(): string {
    return this.languageArrayGlobalService.getItems().join(" -> ");
  }

  ngOnInit() {
    this.getVocabularyRecord();
  }

  getVocabularyRecord(){
    this.languageHubService.getVocabulary(null).subscribe((_res) => {
      this.words = _res
      this.groupWordsByAlphabet();
    });
  }

  onClickLetter(letter: any) {
    this.languageHubService.getVocabulary(letter).subscribe((_res) => {
      this.words = _res
      this.groupWordsByAlphabet();
    });
  }

  groupWordsByAlphabet() {
    this.groupedWords = this.alphabet.map(letter => ({
      letter,
      words: this.words.filter((word: any) => word.word.startsWith(letter))
    })).filter(group => group.words.length > 0);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  goToHome(event: any) {
    this.languageArrayGlobalService.removeItem(
      this.languageArrayGlobalService.getItems().length - 1
    );
    this.location.back();
  }
}
