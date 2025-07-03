import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

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

// Default SEO configuration for UNI PREP
const DEFAULT_SEO_CONFIG: SeoConfig = {
	title: 'UNI PREP - Your Gateway to Global Opportunities',
	author: 'UNI PREP',
	canonicalUrl: 'https://uniprep.ai',
	robots: 'index, follow',
	language: 'en',
	description: 'UNI PREP is your comprehensive platform for global education, career development, and professional growth. Access tools for job seekers, international students, entrepreneurs, and global travelers.',
	keywords: 'UNI PREP, global education, career development, job seekers, international students, entrepreneurs, global opportunities, professional growth, skill development',
	ogTitle: 'UNI PREP - Your Gateway to Global Opportunities',
	ogDescription: 'UNI PREP is your comprehensive platform for global education, career development, and professional growth.',
	ogImage: 'https://uniprep.ai/uniprep-assets/images/uniprep_banner.jpg',
	ogUrl: 'https://uniprep.ai',
	ogType: 'website',
	twitterCard: 'summary_large_image',
	twitterSite: '@uniprep',
	twitterTitle: 'UNI PREP - Your Gateway to Global Opportunities',
	twitterDescription: 'UNI PREP is your comprehensive platform for global education, career development, and professional growth.',
	twitterImage: 'https://uniprep.ai/uniprep-assets/images/uniprep_banner.jpg',
	schema: {
		name: 'UNI PREP',
		url: 'https://uniprep.ai',
		logo: 'https://uniprep.ai/uniprep-assets/images/uniprep_banner.jpg',
		sameAs: [
			'https://www.linkedin.com/company/uniprep',
			'https://twitter.com/uniprep',
			'https://www.facebook.com/uniprep'
		]
	}
};

@Injectable({
	providedIn: "root",
})
export class SeoService {
	constructor(private meta: Meta, private title: Title) {}

	updateMetaTags(config: SeoConfig) {
		// Merge provided config with defaults
		const mergedConfig = this.mergeWithDefaults(config);
		
		this.updateBasicMeta(mergedConfig);
		this.updateFacebookMeta(mergedConfig);
		this.updateTwitterMeta(mergedConfig);
		this.updateSchema(mergedConfig);
		
		// Verify schema was added
		setTimeout(() => {
			this.verifySchemaAdded();
		}, 100);
	}

	private mergeWithDefaults(config: SeoConfig): SeoConfig {
		const merged: SeoConfig = { ...DEFAULT_SEO_CONFIG };

		Object.keys(config).forEach(key => {
			const configKey = key as keyof SeoConfig;
			if (config[configKey] !== undefined && config[configKey] !== null) {
				(merged as any)[configKey] = config[configKey];
			}
		});

		// Always ensure schema is present
		if (!merged.schema) {
			merged.schema = { ...DEFAULT_SEO_CONFIG.schema! };
		} else if (config.schema) {
			merged.schema = { ...DEFAULT_SEO_CONFIG.schema!, ...config.schema };
		}

		return merged;
	}

	// Method to set default SEO tags for the main landing page
	setDefaultSeoTags() {
		// Ensure DOM is ready before updating meta tags
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				this.updateMetaTags({});
			});
		} else {
			this.updateMetaTags({});
		}
	}

	// Method to set SEO tags for specific pages with custom overrides
	setPageSeoTags(pageConfig: Partial<SeoConfig>) {
		this.updateMetaTags(pageConfig);
	}

	private updateBasicMeta(config: SeoConfig) {
		// Add SEO section comment
		const seoComment = document.createComment(" SEO ");
		document.head.appendChild(seoComment);

		// Update title
		if (config.title) {
			this.title.setTitle(config.title);
			// Also update the title tag directly for better SEO
			const titleElement = document.querySelector("title");
			if (titleElement) {
				titleElement.textContent = config.title;
			} else {
				const newTitle = document.createElement("title");
				newTitle.textContent = config.title;
				document.head.appendChild(newTitle);
			}
		}

		// Update author
		if (config.author) {
			this.meta.updateTag({ name: "author", content: config.author });
		}

		// Update canonical URL
		if (config.canonicalUrl) {
			let canonicalLink = document.querySelector('link[rel="canonical"]');
			if (!canonicalLink) {
				canonicalLink = document.createElement("link");
				canonicalLink.setAttribute("rel", "canonical");
				document.head.appendChild(canonicalLink);
			}
			canonicalLink.setAttribute("href", config.canonicalUrl);
		}

		// Update alternate language link
		if (config.alternateUrl) {
			let alternateLink = document.querySelector('link[rel="alternate"]');
			if (!alternateLink) {
				alternateLink = document.createElement("link");
				alternateLink.setAttribute("rel", "alternate");
				alternateLink.setAttribute("hreflang", "en");
				document.head.appendChild(alternateLink);
			}
			alternateLink.setAttribute("href", config.alternateUrl);
		}

		// Update robots meta tag
		if (config.robots) {
			this.meta.updateTag({ name: "robots", content: config.robots });
		}

		// Update language meta tag
		if (config.language) {
			this.meta.updateTag({ name: "language", content: config.language });
		}

		// Update meta description
		if (config.description) {
			this.meta.updateTag({ name: "description", content: config.description });
		}

		// Update keywords
		if (config.keywords) {
			this.meta.updateTag({ name: "keywords", content: config.keywords });
		}

		// Add SEO End section comment
		const seoEndComment = document.createComment(" SEO End ");
		document.head.appendChild(seoEndComment);
	}

	private updateFacebookMeta(config: SeoConfig) {
		// Add Facebook Metadata Start section comment
		const fbStartComment = document.createComment(" Facebook Metadata Start ");
		document.head.appendChild(fbStartComment);

		if (config.ogTitle) {
			this.meta.updateTag({ property: "og:title", content: config.ogTitle });
		}
		if (config.ogDescription) {
			this.meta.updateTag({ property: "og:description", content: config.ogDescription });
		}
		if (config.ogImage) {
			this.meta.updateTag({ property: "og:image", content: config.ogImage });
		}
		if (config.ogUrl) {
			this.meta.updateTag({ property: "og:url", content: config.ogUrl });
		}
		if (config.ogImageHeight) {
			this.meta.updateTag({ property: "og:image:height", content: config.ogImageHeight });
		}
		if (config.ogImageWidth) {
			this.meta.updateTag({ property: "og:image:width", content: config.ogImageWidth });
		}
		if (config.ogType) {
			this.meta.updateTag({ property: "og:type", content: config.ogType });
		}

		// Add Facebook Metadata End section comment
		const fbEndComment = document.createComment(" Facebook Metadata End ");
		document.head.appendChild(fbEndComment);
	}

	private updateTwitterMeta(config: SeoConfig) {
		// Add Twitter Card section comment
		const twitterStartComment = document.createComment(" Twitter Card ");
		document.head.appendChild(twitterStartComment);

		if (config.twitterCard) {
			this.meta.updateTag({ name: "twitter:card", content: config.twitterCard });
		}
		if (config.twitterSite) {
			this.meta.updateTag({ name: "twitter:site", content: config.twitterSite });
		}
		if (config.twitterTitle) {
			this.meta.updateTag({ name: "twitter:title", content: config.twitterTitle });
		}
		if (config.twitterDescription) {
			this.meta.updateTag({ name: "twitter:description", content: config.twitterDescription });
		}
		if (config.twitterImage) {
			this.meta.updateTag({ name: "twitter:image", content: config.twitterImage });
		}

		// Add Twitter Card End section comment
		const twitterEndComment = document.createComment(" Twitter Card End ");
		document.head.appendChild(twitterEndComment);
	}

	private updateSchema(config: SeoConfig) {
		if (config.schema) {
			try {
				// Add Schema section comment
				const schemaStartComment = document.createComment(" Schema ");
				document.head.appendChild(schemaStartComment);

				const schemaScript = document.createElement("script");
				schemaScript.type = "application/ld+json";

				// Create a more comprehensive schema for UNI PREP
				const schemaData = {
					"@context": "https://schema.org",
					"@type": "Organization",
					"name": config.schema.name,
					"url": config.schema.url,
					"logo": config.schema.logo,
					"sameAs": config.schema.sameAs,
					"description": "UNI PREP is your comprehensive platform for global education, career development, and professional growth.",
					"foundingDate": "2020",
					"contactPoint": {
						"@type": "ContactPoint",
						"contactType": "customer service",
						"email": "support@uniprep.ai"
					},
					"address": {
						"@type": "PostalAddress",
						"addressCountry": "Global"
					},
					"serviceArea": {
						"@type": "GeoCircle",
						"geoMidpoint": {
							"@type": "GeoCoordinates",
							"latitude": 0,
							"longitude": 0
						}
					}
				};

				// Use JSON.stringify with indentation
				schemaScript.textContent = JSON.stringify(schemaData, null, 2);

				// Remove existing schema script if any
				const existingSchema = document.querySelector('script[type="application/ld+json"]');
				if (existingSchema) {
					existingSchema.remove();
				}

				document.head.appendChild(schemaScript);

				// Add Schema End section comment
				const schemaEndComment = document.createComment(" Schema End ");
				document.head.appendChild(schemaEndComment);
				
				// Immediate verification
				this.verifySchemaAdded();
				
				// Add a more persistent verification with multiple checks
				setTimeout(() => {
					this.verifySchemaAdded();
				}, 1000);
				
				setTimeout(() => {
					this.verifySchemaAdded();
				}, 3000);
			} catch (error) {
				console.error('Error updating schema:', error);
			}
		} else {
			console.warn('No schema configuration provided');
		}
	}

	// Method to verify schema was added to DOM
	private verifySchemaAdded() {
		const schemaScript = document.querySelector('script[type="application/ld+json"]');
		if (schemaScript) {
			console.log('Schema script found in DOM');
		} else {
			console.warn('Schema script not found in DOM');
		}
	}
}
