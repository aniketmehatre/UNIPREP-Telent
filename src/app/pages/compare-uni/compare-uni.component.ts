import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'uni-compare-uni',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './compare-uni.component.html',
  styleUrl: './compare-uni.component.scss'
})
export class CompareUniComponent {
  active = true;
  toggleSwitch() {
    this.active = !this.active;
  }
  cardItems = [
    {
      img: "i-search.png",
      text: "Search for roles that match your goals",
      description: "Whether it's your first internship or next career leap"
    },
    {
      img: "i-search.png",
      text: "Access opportunities in your city, your country, or anywhere in the world",
    },
    {
      img: "i-search.png",
      text: "Engage directly with real employers",
      description: "from startups to leading global brands"
    },
    {
      img: "i-search.png",
      text: "Stay organized",
      description: "track every application and keep your job hunt on point"
    },
    {
      img: "i-search.png",
      text: "Get matched to roles based on youyr skills and education",
    },
    {
      img: "i-search.png",
      text: "Build a professional profile",
      description: "that gets noticed by the right people"
    },
  ]
}
