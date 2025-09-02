import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { landingServices } from '../landing.service';
import { PlacementSuccessStory } from 'src/app/@Models/landing-page.model';

@Component({
  selector: 'uni-success-story',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './success-story.component.html',
  styleUrls: ['./success-story.component.scss']
})
export class SuccessStoryComponent implements OnInit {

  storyList: PlacementSuccessStory[] = [];

  constructor(private landingServices: landingServices) { }

  ngOnInit(): void {
    this.getSuccessStoryList();
  }

  getSuccessStoryList() {
    this.landingServices.getSuccessStories().subscribe({
      next: res => {
        this.storyList = res.data;
      },
      error: err => {

      }
    })
  }
}
