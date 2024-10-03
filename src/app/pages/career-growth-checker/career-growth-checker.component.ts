import { Component, OnInit } from '@angular/core';
import { CareerGrowthService } from './career-growth-checker.service';

interface JobRole {
  id: number;
  jobrole: string;
}

@Component({
  selector: 'uni-career-growth-checker',
  templateUrl: './career-growth-checker.component.html',
  styleUrls: ['./career-growth-checker.component.scss']
})

export class CareerGrowthCheckerComponent implements OnInit {

  constructor(private careerGrowthService:CareerGrowthService) { }

  options: JobRole[] = [];
  allOptions: JobRole[] = []; 
  hasfilteredoptions: boolean = false; 
  filteredOptions: JobRole[] = []; 
  searchTerm: string = ''; 

  ngOnInit(): void {
    var data = {
      role : ''
    };
    this.careerGrowthService.JobRoles(data).subscribe((res)=>{
      this.options = res; 
      this.allOptions = res; 
      this.filteredOptions = res;
    });
  }

  selectOption(option:any) {
    this.searchTerm = option.jobrole; 
    this.filteredOptions = [];
    this.hasfilteredoptions = false;
  }

  filterOptions(searchTerm: string) {
    const term = searchTerm.trim().toLowerCase();
    this.filteredOptions = this.allOptions.filter(op =>
      op.jobrole.toLowerCase().includes(term)
    );
    if(this.filteredOptions.length > 0) {
      this.hasfilteredoptions = true;
    }
    else {
      this.hasfilteredoptions = false;
    }
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
    this.filterOptions(inputElement.value);
}



}
