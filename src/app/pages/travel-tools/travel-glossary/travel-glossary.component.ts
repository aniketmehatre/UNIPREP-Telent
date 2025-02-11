import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { PageFacadeService } from '../../page-facade.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CarouselModule } from 'primeng/carousel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';



@Component({
    selector: 'uni-travel-glossary',
    templateUrl: './travel-glossary.component.html',
    styleUrls: ['./travel-glossary.component.scss'],
    standalone: true,
    imports: [CommonModule,SkeletonModule,FluidModule,InputTextModule,TooltipModule,ButtonModule,MultiSelectModule,CarouselModule,InputGroupModule,InputGroupAddonModule,FormsModule,ReactiveFormsModule,InputTextModule,SelectModule]
})
export class TravelGlossaryComponent implements OnInit {
  category_dropdown: { id: any, name: string }[] = [];
  selectedCategoryId: number | null = null;
  travelglossarylists: any[] = [];
  groupedTerms: { [key: string]: any[] } = {};
  valueNearYouFilter: string = '';
  constructor( private sanitizer: DomSanitizer, private router: Router,private pageFacade: PageFacadeService,
    private service: TravelToolsService,
  ) { }
  ngOnInit(): void {
    this.category_dropdown = [
      { id: null, name: "All" },
      { id: "A", name: "A" },
      { id: "B", name: "B" },
      { id: "C", name: "C" },
      { id: "D", name: "D" },
      { id: "E", name: "E" },
      { id: "F", name: "F" },
      { id: "G", name: "G" },
      { id: "H", name: "H" },
      { id: "I", name: "I" },
      { id: "J", name: "J" },
      { id: "K", name: "K" },
      { id: "L", name: "L" },
      { id: "M", name: "M" },
      { id: "N", name: "N" },
      { id: "O", name: "O" },
      { id: "P", name: "P" },
      { id: "Q", name: "Q" },
      { id: "R", name: "R" },
      { id: "S", name: "S" },
      { id: "T", name: "T" },
      { id: "U", name: "U" },
      { id: "V", name: "V" },
      { id: "W", name: "W" },
      { id: "X", name: "X" },
      { id: "Y", name: "Y" },
      { id: "Z", name: "Z" },
    ];
    this.getStartUpGlossary(null);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  isSelected(id: number): boolean {
    return this.selectedCategoryId === id;  // Check if this category is selected
  }
  filterCat(id: any) {
    this.selectedCategoryId = id
    this.getStartUpGlossary(id);
  }
  getStartUpGlossary(data: any) {
    var val = {
      alphabet: data
    }
    this.service.getStravelGlossary(val).subscribe((response) => {
      this.travelglossarylists = [];
      this.groupedTerms = {};
      this.travelglossarylists = response.travelglossary;
      this.travelglossarylists.forEach(item => {
        if (!this.groupedTerms[item.alphabet]) {
          this.groupedTerms[item.alphabet] = [];
        }
        this.groupedTerms[item.alphabet].push(item);
      });

    });
  }
  goBack() {
    this.router.navigate(['/pages/travel-tools']);
  }
  // performSearch() {
  //   const filteredData = this.travelglossarylists.filter((item: any) => {
  //     return item.glossaryterm.toLowerCase().includes(this.valueNearYouFilter.toLowerCase());
  //   });
  //   this.groupedTerms = {};
  //   filteredData.forEach(item => {
  //     if (!this.groupedTerms[item.alphabet]) {
  //       this.groupedTerms[item.alphabet] = [];
  //     }
  //     this.groupedTerms[item.alphabet].push(item);
  //   });
  // }
  performSearch() {
    const searchValue = this.valueNearYouFilter.toLowerCase();
    const filteredData = this.travelglossarylists.filter((item: any) => {
      return (
        item.glossaryterm?.toLowerCase().includes(searchValue) ||
      item.summary?.toLowerCase().includes(searchValue) ||
      item.key?.toLowerCase().includes(searchValue)
      );
    });
  
    this.groupedTerms = {};
    filteredData.forEach(item => {
      if (!this.groupedTerms[item.alphabet]) {
        this.groupedTerms[item.alphabet] = [];
      }
      this.groupedTerms[item.alphabet].push(item);
    });
  }
  isObjectEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }
}