import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  yes: any;
  no: any;
  products = [
    {
      id: '1',
      question:'Are you a student looking to study abroad?',
    },
    {
      id: '2',
      question: 'Are you a job seeker?',
    },
    {
      id: '3',
      question: 'Are you an Entrepreneur or looking to become one?',
    },
    {
      id: '4',
      question: 'Are you looking to travel abroad?',
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
