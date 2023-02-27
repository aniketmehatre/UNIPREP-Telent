import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';

@Component({
  selector: 'uni-sop-sample',
  templateUrl: './sop-sample.component.html',
  styleUrls: ['./sop-sample.component.scss']
})
export class SopSampleComponent implements OnInit {
  constructor (private location: Location ,public route: Router) {}

  back(): void {
    this.location.back()
  }

  ngOnInit(): void {
   
    
  }
 
}
