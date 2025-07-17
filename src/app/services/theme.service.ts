
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';
import { LocalStorageService } from "ngx-localstorage";

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme: 'light' | 'dark' = 'light';

  constructor(private http: HttpClient, private storage: LocalStorageService,) {
    this.loadTheme();
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.saveTheme();
  }

  isDarkMode(): boolean {
    return this.theme === 'dark';
  }

  getInitialSwitchState(): boolean {
    const checked = this.getCookie('checked');
    return checked === 'true'; // Convert string to boolean
  }

  private applyTheme(): void {
    const bodyClassList = document.body.classList;
    bodyClassList.remove('lightmode', 'darkmode');
    bodyClassList.add(`${this.theme}mode`);
  }

  private saveTheme(): void {
    this.setCookie('theme', this.theme);
    this.setCookie('checked', this.theme === 'dark' ? 'true' : 'false');
  }


  private loadTheme(): void {
    const theme = this.getCookie('theme');
    // Ensure that `theme` is either 'light' or 'dark'
    this.theme = theme === 'dark' ? 'dark' : 'light';
    this.applyTheme();
  }

  private setCookie(name: string, value: string, days: number = 365): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    let token = this.storage.get(environment.tokenKey);
    document.cookie = `authToken=${token};${name}=${value};${expires};path=/`;
  }

  private getCookie(name: string): string | undefined {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return undefined;
  }


  storeContatForm(val: any): Observable<any> {
    return this.http.post(environment.ApiUrl + '/storeContactForm', val);
  }
}