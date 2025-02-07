import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'uni-launch-soon-tag',
    templateUrl: './launch-soon-tag.component.html',
    styleUrls: ['./launch-soon-tag.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class LaunchSoonTagComponent implements OnInit {
  @Input() message: string = 'Launching Soon'; // Default message

  constructor() { }

  ngOnInit(): void {
  }

}
