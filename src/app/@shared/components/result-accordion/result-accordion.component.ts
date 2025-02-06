import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface ResultAccordionData {
  title: string;
  description: string;
  tooltip?: string;
  score: number;
  type: 'success' | 'warning' | 'danger';
  body?: {
    title: string;
    score?: number;
    data?: any[];
    description: string;
    matchLink?: string[];
    isActive?: boolean;
  }[];
}

@Component({
    selector: 'uni-result-accordion',
    templateUrl: './result-accordion.component.html',
    styleUrls: ['./result-accordion.component.scss'],
    standalone: false
})
export class ResultAccordionComponent {

  @Input() data: ResultAccordionData[] = [];
  @Output() contentClick = new EventEmitter();

  ngOnInit(): void {}

  activate(indexP: number, index: number) {
    this.data.forEach(((d, idx) => {
      d.body = d.body?.map((dd, idxc) => {
        return {
          ...dd,
          isActive: (indexP == idx && index == idxc) ? !dd.isActive : false
        }
      });
    }));
  }
}
