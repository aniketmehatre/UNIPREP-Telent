import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FounderstoolService } from '../founderstool.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-startupglossary',
  templateUrl: './startupglossary.component.html',
  styleUrls: ['./startupglossary.component.scss']
})
export class StartupglossaryComponent implements OnInit {
  category_dropdown: { id: any, name: string }[] = [];
  selectedCategoryId: number | null = null;
  startupglossarylists: any[] = [];
  groupedTerms: { [key: string]: any[] } = {};
  valueNearYouFilter: string = '';
  constructor(private service: FounderstoolService, private sanitizer: DomSanitizer, private router: Router) { }
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
    this.service.getStartUpGlossary(val).subscribe((response) => {
      this.startupglossarylists = [];
      this.groupedTerms = {};
      this.startupglossarylists = response.startupglossary;
      this.startupglossarylists.forEach(item => {
        if (!this.groupedTerms[item.alphabet]) {
          this.groupedTerms[item.alphabet] = [];
        }
        this.groupedTerms[item.alphabet].push(item);
      });

    });
  }
  goBack() {
    this.router.navigate(['/pages/founderstool/founderstoollist']);
  }
  performSearch() {
    const filteredData = this.startupglossarylists.filter((item: any) => {
      return item.glossaryterm.toLowerCase().includes(this.valueNearYouFilter.toLowerCase());
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
