import { Component } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-digital-job-fair-pages',
  standalone: true,
  templateUrl: './digital-job-fair.component.html',
  styleUrls: ['./digital-job-fair.component.scss']
})
export class DigitalJobFairPagesComponent {
  // Set your event date here. For demo, set to 5 days from now if not provided
  eventDate: Date;
  daysToGo = 0;

  constructor(private location: Location) {
    // Default event date = 5 days from now
    const now = new Date();
    const fiveDaysLater = new Date("2025-12-31");
    // You can replace this with any fixed date like: new Date('2025-10-12')
    this.eventDate = fiveDaysLater;
    this.calculateDaysToGo();
  }

  private calculateDaysToGo() {
    const today = new Date();
    const diff = this.eventDate.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    this.daysToGo = Math.max(0, Math.ceil(diff / oneDay));
  }
  backButton() {
    this.location.back();
  }
}
