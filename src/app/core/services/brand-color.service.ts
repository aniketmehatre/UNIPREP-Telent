import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandColorService {
  constructor(private http: HttpClient) {}

  fetchAndApplyColors(brand_primary_color: any, brand_secondary_color: any):void {

    // Replace with your actual API endpoint
    console.log('fetchAndApplyColors');
    this.setThemeColors(brand_primary_color, brand_secondary_color);
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