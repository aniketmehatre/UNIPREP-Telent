import {inject, Injectable} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  updateMetaTags(metaData: {
    title: string;
    description: string;
    keywords?: string;
    url?: string;
    image?: string;
  }) {
    console.log('Updating meta tags with:', metaData);
    
    const {
      title,
      description,
      keywords = 'job seekers, career growth, global jobs, skill development, professional journey, UNIPREP',
      url = window.location.href, // Use current URL as default
      image = 'uniprep-assets/images/landing-page-mock.png' // Use local default image
    } = metaData;

    try {
      // Update page title
      this.titleService.setTitle(title);
      console.log('Title updated to:', title);

      // Update meta tags
      this.metaService.updateTag({ name: 'title', content: title });
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ name: 'keywords', content: keywords });
      this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

      // Open Graph tags
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
      this.metaService.updateTag({ property: 'og:url', content: url });
      this.metaService.updateTag({ property: 'og:image', content: image });

      // Twitter tags
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:description', content: description });
      this.metaService.updateTag({ name: 'twitter:image', content: image });

      console.log('Meta tags updated successfully');
      
      // Verify meta tags were actually updated in the DOM
      setTimeout(() => {
        const titleElement = document.querySelector('title');
        const metaDescription = document.querySelector('meta[name="description"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        
        console.log('DOM Verification:');
        console.log('Title element:', titleElement?.textContent);
        console.log('Meta description:', metaDescription?.getAttribute('content'));
        console.log('OG Title:', ogTitle?.getAttribute('content'));
      }, 100);
    } catch (error) {
      console.error('Error updating meta tags:', error);
    }
  }
}
