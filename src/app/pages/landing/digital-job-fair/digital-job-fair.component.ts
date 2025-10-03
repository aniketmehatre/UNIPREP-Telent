import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { landingServices } from '../landing.service';


@Component({
  selector: 'app-digital-job-fair',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digital-job-fair.component.html'
})
export class DigitalJobFairComponent {
  loading = true;
  error: string | null = null;

  title = 'Digital Job Fair - October 2025';
  description = 'Join Digital Job Fair 2025 to connect with thousands of qualified candidates actively seeking opportunities. Showcase your brand, screen top talent in real-time, and build a strong pipeline for future hiring—all on one powerful digital platform';
  employers: any[] = [];

  constructor(private landingService: landingServices) { }

  ngOnInit() {
    this.landingService.getDigitalJobFair().subscribe({
      next: (res: any) => {
          this.employers = res.data
          this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load Digital Job Fair information.';
        this.loading = false;
      }
    });
  }
}
