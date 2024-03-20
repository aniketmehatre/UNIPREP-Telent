import { Component, OnInit } from '@angular/core';
import { PitchDeskService } from "./pitch-desk.service";
import { FormBuilder, FormGroup } from "@angular/forms";


@Component({
  selector: 'uni-pitch-desk',
  templateUrl: './pitch-desk.component.html',
  styleUrls: ['./pitch-desk.component.scss']
})
export class PitchDeskComponent implements OnInit {
  pitchDeskList: any[] = [];
  page = 0;
  pageSize = 50;
  totalPitchDeckCount = 0;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  countrySelectBox:any = [];
  fundingTypeSelectBox:any = [];
  sectorSelectBox:any = [];
  constructor(private pitchDesk:PitchDeskService, private fb: FormBuilder) { 
    this.filterForm = this.fb.group({
      pitchdeck_name: [''],
      country: [''],
      funding_type: [''],
      sector: [''],
    });
  }

  ngOnInit(): void {
    this.getPitchDeskList();
    this.selectBoxValues();
  }

  getPitchDeskList(){
    this.pitchDesk.getPitchDeskData().subscribe((responce)=>{
      this.totalPitchDeckCount = responce.total_count;
      this.pitchDeskList = responce.data;
    });
  }

  selectBoxValues(){
    this.pitchDesk.getSelectBoxValues().subscribe((responce)=>{
      
      this.countrySelectBox = responce.country;
      this.fundingTypeSelectBox = responce.funding_type;
      this.sectorSelectBox = responce.sectors;
    });
  }

  pageChange(event: any){
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.getPitchDeskList();
  }

  filterBy(){
    this.isFilterVisible = 'block';
  }
}
