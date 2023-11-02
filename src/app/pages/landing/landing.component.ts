import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  countries: any;
  videoUrl = "../../../uniprep-assets/video/uniprepvideo.mp4";
  constructor() { }

  ngOnInit(): void {

     this.countries = [
      {name: 'USA', flag: 'path_to_usa_flag'},
      {name: 'Canada', flag: 'path_to_canada_flag'},
    ];

  }

}