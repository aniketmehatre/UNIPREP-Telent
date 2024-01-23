import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'uni-investor-list',
  templateUrl: './investor-list.component.html',
  styleUrls: ['./investor-list.component.scss']
})
export class InvestorListComponent implements OnInit {

  array: any []= []
  valueNearYouFilter: any;
  constructor(private _location: Location,) { }

  ngOnInit(): void {
    this.loadInvestorData();
  }

  goBack(){
    this._location.back();
  }
  button1Style = {
    'background-color': '#4287f5',
    color: '#fff',

  };

  button2Style = {
    'background-color': '#FFFFFF',
    color: '#000000'
  };

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
}
