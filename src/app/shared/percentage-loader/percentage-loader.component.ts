import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'uni-percentage-loader',
  templateUrl: './percentage-loader.component.html',
  styleUrl: './percentage-loader.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class PercentageLoaderComponent {

  loadingPercentage: number = 0;

  ngOnInit() {
    this.percantageLoader();
  }
  percantageLoader() {
    this.loadingPercentage = 0;
    const percentageInterval = setInterval(() => {
      if (this.loadingPercentage < 99) {
        this.loadingPercentage++;
      } else {
        clearInterval(percentageInterval);
      }
    }, 30);
  }
}
