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
    const primaryPalette = this.setThemePalette(brand_primary_color, 'primary');
    const secondaryPalette = this.setThemePalette(brand_secondary_color, 'secondary');
    this.saveColorsToLocalStorage(brand_primary_color, brand_secondary_color, primaryPalette, secondaryPalette);
  }

  saveColorsToLocalStorage(primary: string, secondary: string, primaryPalette: any, secondaryPalette: any): void {
    localStorage.setItem('brand_primary_color', primary);
    localStorage.setItem('brand_secondary_color', secondary);
    localStorage.setItem('brand_primary_palette', JSON.stringify(primaryPalette));
    localStorage.setItem('brand_secondary_palette', JSON.stringify(secondaryPalette));
  }

  loadColorsFromLocalStorage(): { primary: string, secondary: string, primaryPalette: any, secondaryPalette: any } | null {
    const primary = localStorage.getItem('brand_primary_color');
    const secondary = localStorage.getItem('brand_secondary_color');
    const primaryPalette = localStorage.getItem('brand_primary_palette');
    const secondaryPalette = localStorage.getItem('brand_secondary_palette');
    if (primary && secondary && primaryPalette && secondaryPalette) {
      return {
        primary,
        secondary,
        primaryPalette: JSON.parse(primaryPalette),
        secondaryPalette: JSON.parse(secondaryPalette)
      };
    }
    return null;
  }

  applyPalettesFromLocalStorage(): void {
    const palettes = this.loadColorsFromLocalStorage();
    if (!palettes) return;
    const root = document.documentElement;
    Object.entries(palettes.primaryPalette).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });
    Object.entries(palettes.secondaryPalette).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });
  }

  clearColorLocalStorage(): void {
    localStorage.removeItem('brand_primary_color');
    localStorage.removeItem('brand_secondary_color');
    localStorage.removeItem('brand_primary_palette');
    localStorage.removeItem('brand_secondary_palette');
  }

  private setThemePalette(baseColor: string, prefix: string): { [key: string]: string } {
    const root = document.documentElement;
    const stops = [
      { key: '50', t: 0 },
      { key: '100', t: 0.08 },
      { key: '200', t: 0.16 },
      { key: '300', t: 0.24 },
      { key: '400', t: 0.32 },
      { key: '500', t: 0.5 },
      { key: '600', t: 0.68 },
      { key: '700', t: 0.76 },
      { key: '800', t: 0.84 },
      { key: '900', t: 0.92 },
      { key: '1000', t: 1 }
    ];
    const scale = chroma.scale([
      chroma.mix('white', baseColor, 0.05, 'lab'),
      baseColor,
      chroma(baseColor).darken(2)
    ]).mode('lab');
    const palette: { [key: string]: string } = {};
    stops.forEach(stop => {
      const color = scale(stop.t).hex();
      root.style.setProperty(`--p-${prefix}-${stop.key}`, color);
      palette[`p-${prefix}-${stop.key}`] = color;
    });
    return palette;
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