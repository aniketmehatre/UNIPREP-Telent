import { Component, OnInit } from '@angular/core';
import {LocationService} from "../../location.service";
@Component({
  selector: 'uni-bloglist',
  templateUrl: './bloglist.component.html',
  styleUrls: ['./bloglist.component.scss']
})
export class BloglistComponent implements OnInit {
  blogs: any;

  constructor( private service: LocationService) { }

  ngOnInit(): void {
    this.service.getBlogs().subscribe((response) => {
      this.blogs = response;
    });
  }

}
