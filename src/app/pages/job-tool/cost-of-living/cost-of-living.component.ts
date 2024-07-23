import { Component, OnInit } from '@angular/core';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'uni-cost-of-living',
  templateUrl: './cost-of-living.component.html',
  styleUrls: ['./cost-of-living.component.scss']
})
export class CostOfLivingComponent implements OnInit {
  countries: City[] =[];
  selectedCountry: City ={name:'',code:''};
  filterValue: string = ''
  constructor() { }

  ngOnInit() {
    this.countries = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];
}

resetFunction(options: any) {
    options.reset();
    this.filterValue = '';
}

customFilterFunction(event: KeyboardEvent, options: any) {
    options.filter(event);
}
compare(){
   
}

}
