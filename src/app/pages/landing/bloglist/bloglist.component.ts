import { Component, OnInit } from '@angular/core';
import {LocationService} from "../../../location.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { PaginatorModule } from "primeng/paginator";
import { RouterModule } from '@angular/router';
@Component({
    selector: 'uni-bloglist',
    templateUrl: './bloglist.component.html',
    styleUrls: ['./bloglist.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule, CardModule, PaginatorModule, RouterModule],
})
export class BloglistComponent implements OnInit {
  blogs: any;
  page: number = 1;
  perpage: number = 20;
  total: number = 0;

  constructor( private service: LocationService) { }

  ngOnInit(): void {
    let data = {
      page : this.page,
      perpage: this.perpage,
    }
    this.service.getBlogs(data).subscribe((response) => {
      // console.log(response.blogs);
      this.blogs = response.blogs;
      this.total = response.total;
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
      this.total = response.total;
    });
  }

}
