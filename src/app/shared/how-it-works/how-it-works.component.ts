import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HowItWorksService } from './how-it-works.service';
import { howItWorksLinks } from '../commonData';

@Component({
  selector: 'uni-how-it-works',
  imports: [DialogModule, CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
  standalone: true
})
export class HowItWorksComponent {
  @ViewChild("videoFrame") videoFrame: ElementRef | undefined;
  private sanitizer = inject(DomSanitizer);
  private service = inject(HowItWorksService);
  moduleName: string = '';
  visible: boolean = false;
  howItWorksVideoLink: SafeResourceUrl;
  howItWorksVideoModal: boolean = false;
  constructor() {
    this.service.howItWorksModule$.subscribe(({ visible, moduleName }) => {
      this.visible = visible;
      this.moduleName = moduleName;
      let howItworksVideo = howItWorksLinks[moduleName].video_link;
      if (howItworksVideo) {
        this.howItWorksVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(howItworksVideo);
        this.howItWorksVideoModal = true;
      }
    })
  }

  closeVideoPopup() {
    if (this.videoFrame && this.videoFrame.nativeElement) {
      const player = this.videoFrame.nativeElement as HTMLIFrameElement;
      player.src = '';
    }
    this.howItWorksVideoModal = false;
  }

  openVideoInYoutube() {
    if (!this.howItWorksVideoLink) return;

    // Get the raw URL string from SafeResourceUrl
    const safeUrl = this.howItWorksVideoLink.toString();
    const embedUrl = safeUrl.replace('unsafe:', ''); // Remove 'unsafe:' prefix if present

    // Extract video ID from embed URL
    const videoId = embedUrl.split('/embed/')[1]?.split('?')[0];
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(youtubeUrl, '_blank');
    }
  }
}
