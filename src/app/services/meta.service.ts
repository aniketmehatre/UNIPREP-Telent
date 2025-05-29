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
    const {
      title,
      description,
      keywords = 'job seekers, career growth, global jobs, skill development, professional journey, UNIPREP',
      url = 'https://yourdomain.com', // default or can be passed dynamically
      image = 'https://yourdomain.com/assets/default-og-image.jpg'
    } = metaData;

    this.titleService.setTitle(title);

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
  }
}
