import { Component, ElementRef, HostListener, NgModule, OnInit, ViewChild } from '@angular/core';
import { SuccessStoriesService } from './success-stories.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
    selector: 'uni-success-stories',
    templateUrl: './success-stories.component.html',
    styleUrls: ['./success-stories.component.scss'],
    standalone: false
})
export class SuccessStoriesComponent implements OnInit {
  @ViewChild('videoFrame') videoFrame: ElementRef | undefined;
  tutorials:any=[];
  tutoriallist:any=[];
  showVideoPopup: boolean = false;
  selectedVideoLink: any | null = null;
  constructor(private resourceService: SuccessStoriesService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.resourceService.getResources().subscribe((response:any)=>{
      var tutorials= response.Tutorial;
      tutorials.forEach((element:any) => {
         var tutorial = {
          title: element.title,
          link: element.link,
          coverimage:element.coverimage,
          description:element.description
         }
         this.tutoriallist.push(tutorial);
      });
    });
  }
  openNextPageLink:any;
  openVideoPopup(link: any): void {
    this.openNextPageLink=link
    // Check if it's a YouTube video link
    if (this.isYoutubeVideoLink(link)) {
      // If it's a YouTube video link, extract the video ID and construct the embeddable URL
      const videoId = this.extractYoutubeVideoId(link);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      // If it's not a YouTube video link, use the URL directly
      this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    }
  
    // Set the flag to show the modal
    this.showVideoPopup = true;
  }  

  private isYoutubeVideoLink(link: string): boolean {
    // Check if the link is a YouTube video link based on a simple pattern
    return link.includes('youtube.com') || link.includes('youtu.be');
  }

  private extractYoutubeVideoId(url: string): string {
    const videoIdRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"'&?\n\s]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : '';
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Check if the pressed key is the Escape key (code 27)
    if (event.code === 'Escape') {
      this.closeVideoPopup();
    }
  }
  closeVideoPopup(): void {
    if (this.videoFrame && this.videoFrame.nativeElement) {
      const player = this.videoFrame.nativeElement as HTMLIFrameElement;
      player.src = '';
    }
     this.selectedVideoLink = null;
     this.showVideoPopup = false;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  openNextVideo(){
    window.open(this.openNextPageLink)
  }

}
