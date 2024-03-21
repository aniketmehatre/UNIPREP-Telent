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
  page = 1;
  pageSize = 50;
  totalPitchDeckCount = 0;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  countrySelectBox:any = [];
  fundingTypeSelectBox:any = [];
  sectorSelectBox:any = [];
  valueNearYouFilter:string ="";
  showDiv: boolean = true;

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
    let data = {
      pitchdeck_name: this.filterForm.value.pitchdeck_name ? this.filterForm.value.pitchdeck_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      funding_type: this.filterForm.value.funding_type ? this.filterForm.value.funding_type : '',
      sector: this.filterForm.value.sector ? this.filterForm.value.sector : '',
      page: this.page,
      perpage: this.pageSize,
    }
    this.pitchDesk.getPitchDeskData(data).subscribe((responce)=>{
      this.totalPitchDeckCount = responce.total_count;
      this.pitchDeskList = responce.data;
    });
    this.isFilterVisible = 'none'
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

  clearFilter() {
    this.filterForm.reset();
    this.getPitchDeskList();
  }

  performSearch() {
    if (this.valueNearYouFilter == "") {
      this.getPitchDeskList();
      return;
    }
    var investorSearchData: any = [];
    this.pitchDeskList.filter(item => {
      if (item.pitchdeck_name?.toLowerCase().includes(this.valueNearYouFilter.toLowerCase())) {
        investorSearchData.push(item);
      };
    });
    this.pitchDeskList = [...investorSearchData];
  }

  closeGuidelines(){
    this.showDiv = !this.showDiv;
  }

  showPdf(url: any){
    window.open(url, "_blank");
  }
}
