import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  mainList: any
  isListMainCard: boolean = true;
  selectedCard: any

  constructor(private landingServices: landingServices, private route: ActivatedRoute,
    private router: Router, private location: Location
  ) {
    this.mainList = [
      {
        id: 1,
        name: 'Talents',
        image: 'uniprep-assets/success-stories/Image 1.webp',
      },
      {
        id: 2,
        name: 'Employers',
        image: 'uniprep-assets/success-stories/Image 2.webp',
      },
      {
        id: 3,
        name: 'Institutes',
        image: 'uniprep-assets/success-stories/Image 3.webp',
      },
      {
        id: 4,
        name: 'Partners',
        image: 'uniprep-assets/success-stories/Image 4.webp',
      }
    ]
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.selectedCard = params.get('id');
      if (this.selectedCard) {
        this.isListMainCard = false;
        if (this.selectedCard == 'Talents') {
          this.getSuccessStoryList();
        } else if (this.selectedCard == 'Employers') {
          return;
        } else if (this.selectedCard == 'Institutes') {
          return;
        } else if (this.selectedCard == 'Partners') {
          return;
        }
      } else {
        this.isListMainCard = true;
      }
    });
  }

  onClickCard(item: any) {
    if (item.name == 'Talents') {
      this.router.navigateByUrl('/success-story?id=' + item.name);
    }
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

  goBack() {
    this.location.back()
  }
}
