import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
    selector: 'uni-subscriptioned-data',
    templateUrl: './subscriptioned-data.component.html',
    styleUrls: ['./subscriptioned-data.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
})
export class SubscriptionedDataComponent implements OnInit {

  
  constructor() { }

  ngOnInit(): void {
  }

  buttonclicked1() {

  }

  buttonclicked2() {
    
  }

}
