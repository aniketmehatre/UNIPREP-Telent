import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {LocationService} from "../../location.service";

@Component({
  selector: 'uni-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.scss']
})
export class BlogdetailComponent implements OnInit {
  slug: any;
  blog: any;
  blogs: any;


  constructor(private route: ActivatedRoute, private router: Router, private service: LocationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug');
  });
  let data = {
    slug:this.slug
  }
  this.service.oneBlog(data).subscribe((response) => {
    this.blog = response;
  }); 

  this.service.getFeatBlogs().subscribe((response) => {
    this.blogs = response;
  }); 
    //alert(this.slug)
  }
}
