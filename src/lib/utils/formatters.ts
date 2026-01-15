// src/lib/utils/formatters.ts

export function formatTitle(title: string): string {
    return title.replace(/\&amp;/g, '&')
      .replace(/\&#8217;/g, "'")
      .replace(/\&#8211;/g, '-')
      .replace(/\&#038;/g, '&');
  }
  
  export function extractYear(title: string): string | null {
    const match = title.match(/\((\d{4})\)/);
    return match ? match[1] : null;
  }
  
  export function extractQuality(title: string): string | null {
    const qualities = ['4K', '1080p', '720p', '480p', 'HD', 'BluRay', 'WEB-DL'];
    for (const quality of qualities) {
      if (title.includes(quality)) return quality;
    }
    return null;
  }
  
  // src/lib/utils/slugify.ts
  
  export function slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
  
  // src/lib/utils/validators.ts
  
  export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  export function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  // src/lib/utils/seo.ts
  
  export function generateMetaTags(title: string, description: string, image?: string) {
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : [],
      },
    };
  }