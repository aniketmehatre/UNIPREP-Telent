import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'uni-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef;
  isPlaying = false;
  isDarkMode: boolean;
  displaytandc!: boolean;
  displayprivacypolicy!: boolean;
  displaycancellationpolicy!: boolean;
  displaycontactform!: boolean;
  currentImage: string = '/uniprep-assets/images/feature1.webp';

  showTandC() {
    this.displaytandc = true;
  }
  
  showprivacypolicy() {
    this.displayprivacypolicy = true;
  }
  
  showcancellationpolicy() {
    this.displaycancellationpolicy = true;
  }
  
  showcontactform() {
    this.displaycontactform = true;
  }

  constructor(private themeService: ThemeService) {
    // Initialize the isDarkMode property with the value from the service
    this.isDarkMode = this.themeService.getInitialSwitchState();
  }

  changeImage(imageName: string): void {
    this.currentImage = '/uniprep-assets/images/' + imageName;
  }

  toggleVideo() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  scrollToSection(event: Event, sectionId: string): void {
    // Prevent the default anchor link behavior
    event.preventDefault();

    // Find the element with the given section ID
    const section = document.querySelector(`#${sectionId}`);

    // If the section exists, scroll to it smoothly
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnInit() {
    // Any additional initialization can go here
    this.currentImage = '/uniprep-assets/images/feature1.webp';
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    // After toggling, update the isDarkMode property to reflect the new state
    this.isDarkMode = this.themeService.isDarkMode();
  }
}
