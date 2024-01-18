import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'uni-investor-list',
  templateUrl: './investor-list.component.html',
  styleUrls: ['./investor-list.component.scss']
})
export class InvestorListComponent implements OnInit {

  investorData: any []= []
  valueNearYouFilter: any;
  totalInvestorsCount: any;
  isFilterVisible: string = 'none';
  filterform:FormGroup;
  constructor(private _location: Location, private fb: FormBuilder) {
    this.filterform = this.fb.group({
      from: [''],
      to: [''],
      country: ['']
    });
  }

  ngOnInit(): void {
    this.loadInvestorData();
  }

  goBack(){
    this._location.back();
  }

  performSearch(events:any){
    var data={
      nearby_search:this.valueNearYouFilter
    }
    // this.getEventUpComming(data)
    // this.getPostEvent(data)
  }


  loadInvestorData(){

  }

  filterOnSubmit(){

  }

  pageChange(event: any){

  }
  edit(data: any){

  }

  filterSubmit(){

  }

  closePopup(){

  }

  filterBy(){
    console.log('asdfasdf')
    this.isFilterVisible = 'none';
  }
}
