import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { UserGuideService } from "./user-guide.service";
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient } from "@angular/common/http";
import {PdfViewerModule} from "ng2-pdf-viewer";

@Component({
    selector: "uni-user-guide",
    templateUrl: "./user-guide.component.html",
    styleUrls: ["./user-guide.component.scss"],
    standalone: true,
    imports: [CommonModule, PdfViewerModule, ToastModule, ButtonModule, TooltipModule],
    providers: [MessageService]
})
export class UserGuideComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfViewer') pdfViewer: any;
  pdfUrl: SafeResourceUrl;
  guideList: any[] = [];
  selectedTopic: string = "";
  isIos: boolean = false;
  pdfLoadError: boolean = false;
  isLoading: boolean = true;

  constructor(
    private userGuideService: UserGuideService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
  }

  ngAfterViewInit() {
    // No need to load PDF here as we'll do it in ngOnInit
  }

  ngOnInit(): void {
    this.loadUserGuide();
  }

  loadUserGuide() {
    this.isLoading = true;
    this.pdfLoadError = false;

    this.userGuideService.getUserGuideLink().subscribe(
      (response) => {
        console.log('API Response:', response);
        if (response) {
          // First verify if the URL is accessible
          this.verifyPdfUrl(response);
        } else {
          this.handleError('No PDF URL received from server');
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.handleError('Failed to get PDF URL from server');
      }
    );
  }

  verifyPdfUrl(url: string) {
    // Try to fetch the PDF first to verify it exists and is accessible
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (blob) => {
        if (blob.type === 'application/pdf') {
          // Create a blob URL for the PDF
          const blobUrl = URL.createObjectURL(blob);
          this.loadPdf(blobUrl);
        } else {
          this.handleError('Invalid PDF file received from server');
        }
      },
      (error) => {
        console.error('PDF Fetch Error:', error);
        this.handleError('Failed to access PDF file');
      }
    );
  }

  loadPdf(pdfUrl: string) {
    try {
      if (!pdfUrl) {
        throw new Error('No PDF URL provided');
      }

      console.log('Loading PDF from URL:', pdfUrl);
      
      // For blob URLs, we don't need to sanitize
      this.pdfUrl = pdfUrl.startsWith('blob:') ? pdfUrl : this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      
      if (this.pdfViewer) {
        this.pdfViewer.pdfSrc = pdfUrl;
        
        // Add a small delay before refreshing
        setTimeout(() => {
          this.pdfViewer.refresh();
        }, 100);
      }
    } catch (error) {
      console.error('PDF Load Error:', error);
      this.handleError('Error loading PDF');
    } finally {
      this.isLoading = false;
    }
  }

  onError(error: any) {
    console.error('PDF Viewer Error:', error);
    this.handleError('Error loading PDF');
  }

  handleError(message: string) {
    console.error(message);
    this.pdfLoadError = true;
    this.isLoading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message + '. Please try downloading the file instead.'
    });
  }

  downloadPdf() {
    this.userGuideService.getUserGuideLink().subscribe(
      (url) => {
        if (url) {
          // For download, use the original URL
          window.open(url, '_blank');
        } else {
          this.handleError('No PDF URL available for download');
        }
      },
      (error) => {
        console.error('Download Error:', error);
        this.handleError('Failed to get download URL');
      }
    );
  }

  getPlatform(url: string) {
    try {
      const userAgent = window.navigator.userAgent;
      if (userAgent.match(/iPhone|iPad|iPod/i)) {
        this.isIos = true;
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        let iframeElement: any = document.getElementById("pdfIframe");
        if (iframeElement != null) {
          iframeElement.src = url + "#page=1&zoom=100";
        }
      }
    } catch (error) {
      console.error('Error in getPlatform:', error);
      this.pdfLoadError = true;
    }
  }

  changePdf(item: any) {
    try {
      this.selectedTopic = item.topics;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.url);
      if (this.pdfViewer) {
        this.pdfViewer.pdfSrc = item.url;
        this.pdfViewer.refresh();
      }
    } catch (error) {
      console.error('Error changing PDF:', error);
      this.pdfLoadError = true;
    }
  }

  getUserGuideLinks() {
    this.userGuideService.getUserGuide().subscribe((response) => {
      this.guideList = response;
      this.selectedTopic = this.guideList[0].topics;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        "https://api.uniprep.ai/uniprepapi/storage/app/public/UniprepUserGuide/dashboard.pdf"
      );
    });
  }

  getuserguidelink() {
    this.userGuideService.getUserGuideLink().subscribe((response) => {
      this.getPlatform(response);
    });
  }
}
