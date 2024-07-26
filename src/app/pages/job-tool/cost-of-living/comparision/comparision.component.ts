import { Component, Input, OnInit } from '@angular/core';
interface City {
  name: string;
  code: string;
  flag: string;
}
@Component({
  selector: 'uni-comparision',
  templateUrl: './comparision.component.html',
  styleUrls: ['./comparision.component.scss']
})
export class ComparisionComponent implements OnInit {
  @Input() data = '';
  constructor() { }

  ngOnInit() {
     console.log(this.data);
  }
 

}
