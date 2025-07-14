import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
// @ts-ignore
import chroma from 'chroma-js';

@Injectable({
  providedIn: 'root'
})
export class BrandColorService {
  constructor(private http: HttpClient) {}

  fetchAndApplyColors(brand_primary_color: any, brand_secondary_color: any): void {
    this.setThemePalette(brand_primary_color, 'primary');
    this.setThemePalette(brand_secondary_color, 'secondary');
  }

  private setThemePalette(baseColor: string, prefix: string) {
    const root = document.documentElement;
    const stops = [
      { key: '50', t: 0 },
      { key: '100', t: 0.1 },
      { key: '200', t: 0.2 },
      { key: '300', t: 0.3 },
      { key: '400', t: 0.4 },
      { key: '500', t: 0.5 },
      { key: '600', t: 0.6 },
      { key: '700', t: 0.7 },
      { key: '800', t: 0.8 },
      { key: '900', t: 0.9 },
      { key: '1000', t: 1 }
    ];
    const scale = chroma.scale([
      chroma(baseColor).brighten(2.5),
      baseColor,
      chroma(baseColor).darken(2.5)
    ]).mode('lab');
    stops.forEach(stop => {
      const color = scale(stop.t).hex();
      root.style.setProperty(`--${prefix}-${stop.key}`, color);
    });
  }

  private hexToRgba(hex: string, alpha: number): string {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
} 