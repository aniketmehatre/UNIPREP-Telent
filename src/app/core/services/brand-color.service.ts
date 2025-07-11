import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandColorService {
  constructor(private http: HttpClient) {}

  fetchAndApplyColors(): Observable<{brand_primary_color: string, brand_secondary_color: string}> {
    // Replace with your actual API endpoint
    return this.http.get<{brand_primary_color: string, brand_secondary_color: string}>('/api/brand/colors')
      .pipe(
        tap(colors => {
          this.setThemeColors(colors.brand_primary_color, colors.brand_secondary_color);
        })
      );
  }

  private setThemeColors(primary: string, secondary: string) {
    const root = document.documentElement;
    root.style.setProperty('--uniprep-primary', primary);
    root.style.setProperty('--uniprep-secondary', secondary);
    // Optionally, set opacity variants
    root.style.setProperty('--uniprep-primaryop10', this.hexToRgba(primary, 0.1));
    root.style.setProperty('--uniprep-primaryop30', this.hexToRgba(primary, 0.3));
    root.style.setProperty('--uniprep-secondaryop10', this.hexToRgba(secondary, 0.1));
    root.style.setProperty('--uniprep-secondaryop30', this.hexToRgba(secondary, 0.3));
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