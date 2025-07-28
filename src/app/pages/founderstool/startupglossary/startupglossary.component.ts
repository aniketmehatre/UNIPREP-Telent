import { Component, OnInit } from '@angular/core';
import { FounderstoolService } from '../founderstool.service';
import { Router } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
  selector: 'uni-startupglossary',
  templateUrl: './startupglossary.component.html',
  styleUrls: ['./startupglossary.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class StartupglossaryComponent implements OnInit {
  category_dropdown: { id: any, name: string }[] = [];
  selectedCategoryId: number | null = null;
  startupglossarylists: any[] = [];
  groupedTerms: { [key: string]: any[] } = {};
  valueNearYouFilter: string = '';
  constructor(private service: FounderstoolService, private router: Router,
    private pageFacade: PageFacadeService) { }
  ngOnInit(): void {
    this.category_dropdown = [
      { id: null, name: "All" },
      { id: null, name: "|" },
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

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("startup-glossary");
  }

  isSelected(id: number): boolean {
    return this.selectedCategoryId === id;  // Check if this category is selected
  }
  filterCat(id: any) {
    this.selectedCategoryId = id
    this.getStartUpGlossary(id);
  }
  getStartUpGlossary(data: any) {
    if (!data) {
      return;
    }
    var val = {
      alphabet: data
    }
    this.service.getStartUpGlossary(val).subscribe((response) => {
      this.startupglossarylists = [];
      this.groupedTerms = {};
      this.startupglossarylists = response.startupglossary;
      this.startupglossarylists.forEach(item => {
        if (!this.groupedTerms[item.alphabet]) {
          this.groupedTerms[item.alphabet] = [];
        }
        this.groupedTerms[item.alphabet].push(item);
        this.performSearch("init");
      });

    });
  }
  goBack() {
    this.router.navigate(['/pages/founderstool/founderstoollist']);
  }
  performSearch(from?: string) {
    if (!from) {
     
    }
    // highlights the words
    const search = this.valueNearYouFilter?.trim();
    if (!search) {
      this.resetHighlights(); // Optional: show full terms without highlights
      return;
    }

    const highlight = (text: string) =>
      text.split(new RegExp(`(${search})`, 'gi')).map(part => ({
        word: part,
        highlight: part.toLowerCase() === search.toLowerCase()
      }));

    for (const key in this.groupedTerms) {
      this.groupedTerms[key].forEach(term => {
        term.glossarytermParts = highlight(term.glossaryterm);
        term.summaryParts = highlight(term.summary);
      });
    }
    // normal searcth code
    const searchValue = this.valueNearYouFilter.toLowerCase()
    const filteredData = this.startupglossarylists.filter((item: any) => {
      return item.glossaryterm?.toLowerCase().includes(searchValue) || item.summary?.toLowerCase().includes(searchValue) || item.key?.toLowerCase().includes(searchValue)

    })
    this.groupedTerms = {}
    filteredData.forEach((item) => {
      if (!this.groupedTerms[item.alphabet]) {
        this.groupedTerms[item.alphabet] = []
      }
      this.groupedTerms[item.alphabet].push(item)
    })
  }
  isObjectEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }
  resetHighlights() {
    for (const key in this.groupedTerms) {
      this.groupedTerms[key].forEach(term => {
        term.glossarytermParts = [{ word: term.glossaryterm, highlight: false }];
        term.summaryParts = [{ word: term.summary, highlight: false }];
      });
    }
  }
}
