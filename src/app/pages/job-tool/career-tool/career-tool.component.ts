import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-career-tool',
  templateUrl: './career-tool.component.html',
  styleUrls: ['./career-tool.component.scss']
})
export class CareerToolComponent implements OnInit {
  currentEndpoint:string = "";
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  chooseOneOption(mode: string){
    this.currentEndpoint = mode;
    if(mode == "cv-builder"){
      this.router.navigate(['/pages/job-tool/cv-builder']);
    }else if(mode == "coverletter-builder"){
      this.router.navigate(['/pages/job-tool/coverletter-builder']);
    }
    else{
      this.router.navigate(['/pages/job-tool/cost-of-living']);
    }
  }
}
