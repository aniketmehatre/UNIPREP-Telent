import { Component, OnInit, ViewChild } from '@angular/core';
import {LocationService} from "../../../location.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { PaginatorModule } from "primeng/paginator";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ObjectModel } from 'src/app/@Models/object.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Popover, PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { CategoriesList } from 'src/app/@Models/career-tool-category.model';

export interface Blog {
  id: number
  blog_categories_id: number
  title: string
  tag: any
  slug: string
  seo_title: string
  meta_description: any
  meta_tags: any
  featured_img: string
  meta_author: string
  content: string
  status: number
  created_at: string
  updated_at: any
  deleted_at: any
  category: string
  date: string
  desc: string
}

@Component({
    selector: 'uni-bloglist',
    templateUrl: './bloglist.component.html',
    styleUrls: ['./bloglist.component.scss'],
    standalone: true,
  imports: [CommonModule, PopoverModule, DialogModule, SelectModule, CardModule, PaginatorModule, RouterModule, FormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule],
})
export class BloglistComponent implements OnInit {
  @ViewChild('op') op!: Popover;
  blogs: Blog[] = [];
  page: number = 1;
  perpage: number = 20;
  totalBlogs: number = 0;
  first: number = 0;
  searchTerm: string = '';
  categoryList: CategoriesList[] = [];
  selectedCategory: number | null = null;
  constructor( private service: LocationService) { }

  ngOnInit(): void {
    this.getBlogsList();
  }

  getBlogsList(params?: ObjectModel) {
    const data = {
      page : this.page,
      perpage: this.perpage,
      ...params
    }
    this.service.getBlogs(data).subscribe((response) => {
      this.blogs = response.blogs;
      this.totalBlogs = response.total;
    });
  }

  onPageChange(event: any) {
    this.page = event.page + 1;
    this.perpage = event.rows;
    this.getBlogsList();
  }

  onSelectCategory() {
    this.getBlogsList({ category: this.selectedCategory });
    this.selectedCategory = null;
    this.op.hide();
  }

  onClickFilterBlog(event: any) {
    this.op.toggle(event);
    this.getCategoryList();
  }

  onSearchBlogs() {
    this.getBlogsList({ searchblogs: this.searchTerm ?? null });
  }

  getCategoryList() {
    this.service.getCategoriesList().subscribe({
      next: response => {
        this.categoryList = response;
      },
      error: error => {
        console.error(error.error.message);
      }
    })
  }

}


