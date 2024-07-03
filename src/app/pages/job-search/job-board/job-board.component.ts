import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.scss']
})
export class JobBoardComponent implements OnInit {
  numbers: number[] = Array(20).fill(0).map((x, i) => i + 1);
  
  constructor() { }

  ngOnInit(): void {
  }

}
