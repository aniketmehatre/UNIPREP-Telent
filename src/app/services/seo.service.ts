import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoConfig {
  title?: string;
  author?: string;
  canonicalUrl?: string;
  alternateUrl?: string;
  robots?: string;
  language?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogImageHeight?: string;
  ogImageWidth?: string;
  ogType?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: {
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateMetaTags(config: SeoConfig) {
    this.updateBasicMeta(config);
    this.updateFacebookMeta(config);
    this.updateTwitterMeta(config);
    this.updateSchema(config);
  }

  private updateBasicMeta(config: SeoConfig) {
    // Add SEO section comment
    const seoComment = document.createComment(' SEO ');
    document.head.appendChild(seoComment);

    // Update title
    if (config.title) {
      this.title.setTitle(config.title);
      // Also update the title tag directly for better SEO
      const titleElement = document.querySelector('title');
      if (titleElement) {
        titleElement.textContent = config.title;
      } else {
        const newTitle = document.createElement('title');
        newTitle.textContent = config.title;
        document.head.appendChild(newTitle);
      }
    }

    // Update author
    if (config.author) {
      this.meta.updateTag({ name: 'author', content: config.author });
    }

    // Update canonical URL
    if (config.canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', config.canonicalUrl);
    }

    // Update alternate language link
    if (config.alternateUrl) {
      let alternateLink = document.querySelector('link[rel="alternate"]');
      if (!alternateLink) {
        alternateLink = document.createElement('link');
        alternateLink.setAttribute('rel', 'alternate');
        alternateLink.setAttribute('hreflang', 'en');
        document.head.appendChild(alternateLink);
      }
      alternateLink.setAttribute('href', config.alternateUrl);
    }

    // Update robots meta tag
    if (config.robots) {
      this.meta.updateTag({ name: 'robots', content: config.robots });
    }

    // Update language meta tag
    if (config.language) {
      this.meta.updateTag({ name: 'language', content: config.language });
    }

    // Update meta description
    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
    }

    // Update keywords
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Add SEO End section comment
    const seoEndComment = document.createComment(' SEO End ');
    document.head.appendChild(seoEndComment);
  }

  private updateFacebookMeta(config: SeoConfig) {
    // Add Facebook Metadata Start section comment
    const fbStartComment = document.createComment(' Facebook Metadata Start ');
    document.head.appendChild(fbStartComment);

    if (config.ogTitle) {
      this.meta.updateTag({ property: 'og:title', content: config.ogTitle });
    }
    if (config.ogDescription) {
      this.meta.updateTag({ property: 'og:description', content: config.ogDescription });
    }
    if (config.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: config.ogImage });
    }
    if (config.ogUrl) {
      this.meta.updateTag({ property: 'og:url', content: config.ogUrl });
    }
    if (config.ogImageHeight) {
      this.meta.updateTag({ property: 'og:image:height', content: config.ogImageHeight });
    }
    if (config.ogImageWidth) {
      this.meta.updateTag({ property: 'og:image:width', content: config.ogImageWidth });
    }
    if (config.ogType) {
      this.meta.updateTag({ property: 'og:type', content: config.ogType });
    }

    // Add Facebook Metadata End section comment
    const fbEndComment = document.createComment(' Facebook Metadata End ');
    document.head.appendChild(fbEndComment);
  }

  private updateTwitterMeta(config: SeoConfig) {
    // Add Twitter Card section comment
    const twitterStartComment = document.createComment(' Twitter Card ');
    document.head.appendChild(twitterStartComment);

    if (config.twitterCard) {
      this.meta.updateTag({ name: 'twitter:card', content: config.twitterCard });
    }
    if (config.twitterSite) {
      this.meta.updateTag({ name: 'twitter:site', content: config.twitterSite });
    }
    if (config.twitterTitle) {
      this.meta.updateTag({ name: 'twitter:title', content: config.twitterTitle });
    }
    if (config.twitterDescription) {
      this.meta.updateTag({ name: 'twitter:description', content: config.twitterDescription });
    }
    if (config.twitterImage) {
      this.meta.updateTag({ name: 'twitter:image', content: config.twitterImage });
    }

    // Add Twitter Card End section comment
    const twitterEndComment = document.createComment(' Twitter Card End ');
    document.head.appendChild(twitterEndComment);
  }

  private updateSchema(config: SeoConfig) {
    if (config.schema) {
      // Add Schema section comment
      const schemaStartComment = document.createComment(' Schema ');
      document.head.appendChild(schemaStartComment);

      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      
      // Format the JSON with proper indentation
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: config.schema.name,
        url: config.schema.url,
        logo: config.schema.logo,
        sameAs: config.schema.sameAs
      };
      
      // Use JSON.stringify with indentation
      schemaScript.text = JSON.stringify(schemaData, null, 4);
      
      // Remove existing schema script if any
      const existingSchema = document.querySelector('script[type="application/ld+json"]');
      if (existingSchema) {
        existingSchema.remove();
      }
      
      document.head.appendChild(schemaScript);

      // Add Schema End section comment
      const schemaEndComment = document.createComment(' Schema End ');
      document.head.appendChild(schemaEndComment);
    }
  }
} 