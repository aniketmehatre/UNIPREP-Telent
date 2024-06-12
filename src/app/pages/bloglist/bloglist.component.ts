import { Component, OnInit } from '@angular/core';
import {LocationService} from "../../location.service";
@Component({
  selector: 'uni-bloglist',
  templateUrl: './bloglist.component.html',
  styleUrls: ['./bloglist.component.scss']
})
export class BloglistComponent implements OnInit {
  blogs: any;
  page: number = 1;
  perpage: number = 20;
  total: number | undefined;

  constructor( private service: LocationService) { }

  ngOnInit(): void {
    let data = {
      page : this.page,
      perpage: this.perpage,
    }
    this.service.getBlogs(data).subscribe((response) => {
      // console.log(response.blogs);
      this.blogs = response.blogs;
    });
  }

  paginate(event:any){
    let data = {
      page : event.page + 1,
      perpage: event.rows,
    }
    this.service.getBlogs(data).subscribe((response) => {
      // console.log(response.blogs);
      this.blogs = response.blogs;
    });
  }

}
